// src/store/useBudgetStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useCategoryStore } from "@/store/useCategoryStore";

const pad2 = (n) => String(n).padStart(2, "0");
const getCurrentYyyymm = () => {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}`; // e.g. '202509'
};

/**
 * budgets_with_usage_name 뷰 컬럼 가정:
 * - id, user_id, yyyymm, category_id, limit_amount, used_amount, name, icon_key ...
 * budgets 테이블 PK/FK:
 * - user_id (FK -> profiles.id)
 * - category_id (FK -> categories.id)
 * - unique(user_id, yyyymm, category_id)
 * categories 테이블 PK/FK:
 * - user_id (FK -> profiles.id)
 * - unique(user_id, name)
 */

export const useBudgetStore = create((set, get) => ({
  loading: false,
  yyyymm: getCurrentYyyymm(),
  items: [],

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
        .eq("user_id", user.id) // 성능 + 안전
        .eq("yyyymm", yyyymm);

      if (error) throw error;
      set({ items: data ?? [], loading: false });
    } catch (e) {
      console.error("[fetchThisMonth error]", e);
      set({ items: [], loading: false });
    }
  },

  refresh: async () => get().fetchThisMonth({ force: true }),

  // CREATE / UPSERT
  addBudget: async ({ categoryId, name, icon_key, limit_amount }) => {
    // 로그인 보장
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    if (!user) throw new Error("로그인이 필요합니다");

    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' });

    let cid = categoryId;

    // 1) 카테고리 upsert (user_id 반드시 포함!)
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

      // 전역 카테고리 스토어 갱신(존재 시 교체, 없으면 추가)
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
    // 보통 RLS가 user_id=auth.uid()로 보호하므로 id만으로도 안전
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

  // (옵션) 로그아웃 시 초기화
  reset: () => set({ items: [] }),
}));
