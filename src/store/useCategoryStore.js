import { create } from "zustand"
import { supabase } from "@/lib/supabaseClient"

export const useCategoryStore = create((set, get) => ({
  loading: false,
  items: [], // {id, name, icon_key, kind}

  fetchAll: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return set({ items: [], loading: false })
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, icon_key, kind")
        .eq("user_id", user.id)
        .order("name", { ascending: true })
      if (error) throw error
      set({ items: data ?? [] })
    } finally {
      set({ loading: false })
    }
  },

  // 신규 생성 직후, 폼들에 즉시 반영하기 위한 로컬 추가
  addLocal: (cat) => set((s) => ({ items: [...s.items, cat] })),
}))
