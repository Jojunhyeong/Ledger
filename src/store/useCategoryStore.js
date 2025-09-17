// src/store/useCategoryStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

/**
 * categories:  id (uuid), user_id (uuid fk->profiles.id or auth.users.id), name (text), icon_key (text)
 * UNIQUE (user_id, name)
 * RLS 예시:
 *  - SELECT/INSERT/UPDATE/DELETE: using (user_id = auth.uid())
 */

export const useCategoryStore = create((set, get) => ({
  loading: false,
  items: [], // [{ id, name, icon_key }]

  // READ
  async fetchAll() {
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

      // kind 컬럼이 있을 수도/없을 수도 있는 환경 대응
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

  /**
   * CREATE/UPSERT
   * - FK 에러 방지: profiles에 사용자 행이 없으면 먼저 upsert로 보장
   * - UNIQUE (user_id, name) 기반 멱등 처리
   */
  async upsert({ name, icon_key }) {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    if (!user) throw new Error("로그인이 필요합니다");

    // 🔐 FK 보장 (profiles.id = user.id 행이 반드시 존재하도록)
    await supabase
      .from("profiles")
      .upsert({ id: user.id }, { onConflict: "id" });

    // 실제 upsert
    const { data, error } = await supabase
      .from("categories")
      .upsert(
        { user_id: user.id, name, icon_key },
        { onConflict: "user_id,name" }
      )
      .select("id, name, icon_key")
      .single();

    if (error) throw error;

    // 로컬 상태 갱신
    set((s) => {
      const exists = s.items.some((c) => c.id === data.id);
      const items = exists
        ? s.items.map((c) => (c.id === data.id ? { ...c, ...data } : c))
        : [...s.items, data];
      return { items };
    });

    return data;
  },

  // UPDATE
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

  // 로컬에 즉시 추가(필요 시)
  addLocal(cat) {
    set((s) => {
      const exists = s.items.some((c) => c.id === cat.id);
      return exists ? s : { items: [...s.items, cat] };
    });
  },

  // 초기화
  reset() {
    set({ items: [] });
  },
}));
