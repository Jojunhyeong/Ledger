import { create } from "zustand"
import { supabase } from "@/lib/supabaseClient"
import { useCategoryStore } from "@/store/useCategoryStore"

const pad2 = (n) => String(n).padStart(2, "0")
const getCurrentYyyymm = () => {
  const d = new Date()
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}` // '202509'
}

export const useBudgetStore = create((set, get) => ({
  loading: false,
  yyyymm: getCurrentYyyymm(),
  items: [], // budgets_with_usage_name rows

  // READ
  fetchThisMonth: async ({ force = false } = {}) => {
    if (!force && get().items.length > 0) return
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { set({ items: [], loading: false }); return }

      const yyyymm = get().yyyymm
      const { data, error } = await supabase
        .from("budgets_with_usage_name")
        .select("*")
        .eq("user_id", user.id)
        .eq("yyyymm", yyyymm)

      if (error) throw error
      set({ items: data ?? [], loading: false })
    } catch (e) {
      console.error("[fetchThisMonth error]", e)
      set({ items: [], loading: false })
    }
  },

  refresh: async () => get().fetchThisMonth({ force: true }),

  // CREATE (기존 카테고리 선택 or 신규 생성)
  addBudget: async ({ categoryId, name, icon_key, limit_amount }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("로그인이 필요합니다")

    let cid = categoryId
    if (!cid) {
      // kind NOT NULL이므로 기본 'expense'
      const { data: cat, error: catErr } = await supabase
        .from("categories")
        .insert({ user_id: user.id, name, icon_key, kind: "expense" })
        .select("id, name, icon_key, kind")
        .single()
      if (catErr) throw catErr
      cid = cat.id
      // 트랜잭션 폼/다른 곳에 즉시 반영
      useCategoryStore.getState().addLocal(cat)
    }

    const yyyymm = get().yyyymm
    const { error: budErr } = await supabase
      .from("budgets")
      .insert({ user_id: user.id, yyyymm, category_id: cid, limit_amount })
    if (budErr) throw budErr

    await get().refresh()
  },

  // UPDATE
  updateBudget: async (id, { limit_amount }) => {
    const { error } = await supabase
      .from("budgets")
      .update({ limit_amount })
      .eq("id", id)
    if (error) throw error
    await get().refresh()
  },

  // DELETE
  deleteBudget: async (id) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id)
    if (error) throw error
    await get().refresh()
  },
}))
