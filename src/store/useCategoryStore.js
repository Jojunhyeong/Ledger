// src/store/useCategoryStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useCategoryStore = create((set, get) => ({
  loading: false,
  items: [], // [{ id, name, icon_key, kind? }]

  // READ
  async fetchAll() {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ items: [], loading: false });
        return;
      }

      // kind 컬럼이 없을 수도 있으므로 시도 → 실패하면 kind 제외하고 다시 시도
      let { data, error } = await supabase
        .from("categories")
        .select("id, name, icon_key, kind")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error && /column .* kind .* does not exist/i.test(error.message)) {
        const retry = await supabase
          .from("categories")
          .select("id, name, icon_key")
          .eq("user_id", user.id)
          .order("name", { ascending: true });
        data = retry.data;
        error = retry.error;
      }
      if (error) throw error;

      set({ items: data ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  async refresh() {
    return get().fetchAll();
  },

  // CREATE/UPSERT (user_id는 보내지 않음: DB가 auth.uid()로 채움)
  async upsert({ name, icon_key }) {
    // (user_id, name) 유니크 인덱스가 있어야 함
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name, icon_key }, { onConflict: "user_id,name" })
      .select("id, name, icon_key") // kind가 없어도 안전
      .single();

    if (error) throw error;

    // 로컬 상태도 갱신(중복 방지)
    set((s) => {
      const exists = s.items.some((c) => c.id === data.id);
      const items = exists
        ? s.items.map((c) => (c.id === data.id ? { ...c, ...data } : c))
        : [...s.items, data];
      return { items };
    });

    return data;
  },

  // UPDATE: 이름/아이콘 변경
  async rename(id, { name, icon_key }) {
    const { data, error } = await supabase
      .from("categories")
      .update({ name, icon_key })
      .eq("id", id)
      .select("id, name, icon_key")
      .single();
    if (error) throw error;

    set((s) => ({
      items: s.items.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));

    return data;
  },

  // DELETE
  async remove(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    set((s) => ({ items: s.items.filter((c) => c.id !== id) }));
  },

  // 로컬에 즉시 추가(폼 제출 직후 대비용)
  addLocal(cat) {
    set((s) => {
      const exists = s.items.some((c) => c.id === cat.id);
      return exists ? s : { items: [...s.items, cat] };
    });
  },

  // 로그아웃 등 초기화
  reset() {
    set({ items: [] });
  },
}));
