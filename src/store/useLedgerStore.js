import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

const pad2 = (n) => String(n).padStart(2, '0')
const monthRange = (y, m) => {
  const last = new Date(y, m, 0).getDate()
  const ym = `${y}-${pad2(m)}`
  return { from: `${ym}-01`, to: `${ym}-${pad2(last)}` }
}

export const useLedgerStore = create((set, get) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  loading: false,

  // 월별 캐시: { 'YYYY-MM': Array<Transaction> }
  itemsByKey: {},

  setYearMonth: (y, m) => set({ year: y, month: m }),

  fetchMonth: async (y, m, { force = false } = {}) => {
    const key = `${y}-${pad2(m)}`
    if (!force && get().itemsByKey[key]) return

    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set((s) => ({ itemsByKey: { ...s.itemsByKey, [key]: [] } }))
        return
      }

      const { from, to } = monthRange(y, m)
      const { data, error } = await supabase
        .from('v_transactions_full')
        // ✅ 실제 스키마에 맞게 type 사용
        .select('id, date, amount, category, description, type, user_id')
        .eq('user_id', user.id)
        .gte('date', from)
        .lte('date', to)
        .order('date', { ascending: false })

      if (error) throw error

      set((s) => ({
        itemsByKey: { ...s.itemsByKey, [key]: data ?? [] },
      }))
    } catch (e) {
      console.error('[fetchMonth error]', e)
      set((s) => ({ itemsByKey: { ...s.itemsByKey, [key]: [] } }))
    } finally {
      set({ loading: false })
    }
  },
}))
