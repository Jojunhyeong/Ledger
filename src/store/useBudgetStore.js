// src/store/useBudgetStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useCategoryStore } from "@/store/useCategoryStore";

const pad2 = (n) => String(n).padStart(2, "0");
const getCurrentYyyymm = () => {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}`; // e.g. '202509'
};

export const useBudgetStore = create((set, get) => ({
  loading: false,
  yyyymm: getCurrentYyyymm(),
  items: [], // [{ budget_id, category_id, category_name, category_icon_key, limit_amount, used_amount, yyyymm }]

  // READ
  fetchThisMonth: async ({ force = false } = {}) => {
    if (!force && get().items.length > 0) return;
    set({ loading: true });
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      if (!user) {
        set({ items: [], loading: false });
        return;
      }

      const yyyymm = get().yyyymm;
      const { data, error } = await supabase
        .from("budgets_with_usage_name")
        .select("*")
        .eq("user_id", user.id)
        .eq("yyyymm", yyyymm);

      if (error) throw error;

      // ✅ 뷰 컬럼 이름이 프로젝트마다 조금 다를 수 있으니 안전하게 매핑
      const items = (data ?? []).map((r) => ({
        budget_id: r.budget_id,
        category_id: r.category_id,
        // 뷰가 name 또는 category_name 중 하나를 줄 수 있음
        category_name: r.category_name ?? r.name ?? "기타",
        // icon_key는 그대로 사용하되, 없으면 'wallet'로 폴백
        category_icon_key: r.icon_key ?? "wallet",
        limit_amount: r.limit_amount ?? 0,
        used_amount: r.used_amount ?? 0,
        yyyymm: r.yyyymm,
      }));

      set({ items, loading: false });
    } catch (e) {
      console.error("[fetchThisMonth error]", e);
      set({ items: [], loading: false });
    }
  },

  refresh: async () => get().fetchThisMonth({ force: true }),

  // CREATE / UPSERT
  addBudget: async ({ categoryId, name, icon_key, limit_amount }) => {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    if (!user) throw new Error("로그인이 필요합니다");

    await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

    let cid = categoryId;

    // 1) 카테고리 upsert (존재하지 않으면 생성)
    if (!cid) {
      const { data: cat, error: catErr } = await supabase
        .from("categories")
        .upsert(
          { user_id: user.id, name, icon_key },
          { onConflict: "user_id,name" }
        )
        .select("id, name, icon_key")
        .single();

      if (catErr) throw catErr;
      cid = cat.id;

      // 카테고리 스토어도 즉시 갱신
      useCategoryStore.getState().addLocal(cat);
    }

    // 2) 예산 upsert (unique: user_id, yyyymm, category_id)
    const yyyymm = get().yyyymm;
    const { error: budErr } = await supabase
      .from("budgets")
      .upsert(
        { user_id: user.id, yyyymm, category_id: cid, limit_amount },
        { onConflict: "user_id,yyyymm,category_id" }
      );

    if (budErr) throw budErr;

    await get().refresh();
  },

  // UPDATE
  updateBudget: async (id, { limit_amount }) => {
    const { error } = await supabase
      .from("budgets")
      .update({ limit_amount })
      .eq("id", id);
    if (error) throw error;
    await get().refresh();
  },

  // DELETE
  deleteBudget: async (id) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw error;
    await get().refresh();
  },

  // 로그아웃 등 초기화
  reset: () => set({ items: [] }),
}));
