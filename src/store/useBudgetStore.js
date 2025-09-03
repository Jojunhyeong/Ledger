// src/store/useBudgetStore.js
import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

const pad2 = (n) => String(n).padStart(2, '0')
const getCurrentYyyymm = () => {
  const d = new Date()
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}` // '202509'
}

export const useBudgetStore = create((set, get) => ({
  loading: false,
  yyyymm: getCurrentYyyymm(),   // 현재 달만 관리
  items: [],                    // budgets_with_usage_name 로우들

  // 이번 달만 가져오기
  fetchThisMonth: async ({ force = false } = {}) => {
    if (!force && get().items.length > 0) return

    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { set({ items: [], loading: false }); return }

      const yyyymm = get().yyyymm
      const { data, error } = await supabase
        .from('budgets_with_usage_name')     // ← A안 뷰
        .select('*')
        .eq('user_id', user.id)
        .eq('yyyymm', yyyymm)

      if (error) throw error
      set({ items: data ?? [], loading: false })
    } catch (e) {
      console.error('[fetchThisMonth error]', e)
      set({ items: [], loading: false })
    }
  },

  // 외부 변경(거래/예산 추가·삭제) 뒤 강제 리프레시용 헬퍼
  refresh: async () => get().fetchThisMonth({ force: true }),
}))
