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

// src/store/useBudgetStore.js
addBudget: async ({ categoryId, name, icon_key, limit_amount }) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  let cid = categoryId
  if (!cid) {
   // 1) 같은 이름 카테고리가 이미 있으면 재사용
   const { data: existing } = await supabase
  .from('categories')
  .select('id, name, icon_key')
  .eq('user_id', user.id)
  .eq('name', name)
  .maybeSingle()
  if (existing) {
    cid = existing.id
  } else {
    // 2) 없으면 새로 생성
   // kind 넣지 않음: 이름 하나로 통일
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .insert({ user_id: user.id, name, icon_key })
    .select('id, name, icon_key')
    .single()
  if (catErr) {
    // 유니크 제약에 걸린 동시성/중복 방지: 이미 있으면 다시 조회해서 재사용
    if (catErr.code === '23505') {
      const { data: again } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id).eq('name', name)
        .maybeSingle()
      cid = again?.id
    } else {
      throw catErr
    }
  } else {
    cid = cat.id
    useCategoryStore.getState().addLocal(cat)
  }
      if (catErr) throw catErr
      cid = cat.id
      // 전역 카테고리 스토어에 즉시 반영
      useCategoryStore.getState().addLocal(cat)
  }
  }

  const yyyymm = get().yyyymm
  const { error: budErr } = await supabase
    .from('budgets')
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
