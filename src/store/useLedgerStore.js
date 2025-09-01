import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

const pad2 = (n) => String(n).padStart(2, '0')
const monthRange = (y, m) => {
  const last = new Date(y, m, 0).getDate()
  const ym = `${y}-${pad2(m)}`
  return { from: `${ym}-01`, to: `${ym}-${pad2(last)}` }
}
const toDbType = (t) => {
  if (t === 'income' || t === 'expense') return t
  if (t === '수입') return 'income'
  if (t === '지출') return 'expense'
  throw new Error('type 값이 올바르지 않습니다. (수입/지출 또는 income/expense)')
}

export const useLedgerStore = create((set, get) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  loading: false,

  // 월별 캐시: { 'YYYY-MM': Array<TransactionRowFromView> }
  itemsByKey: {},

  setYearMonth: (y, m) => set({ year: y, month: m }),

  // 이름으로 받아 insert: 계정/카테고리 없으면 생성 → transactions에 기록 → 해당 월 캐시 리프레시
  addTransactionByNames: async ({ date, type, amount, categoryName, accountName, description, memo }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const dbType = toDbType(type)
    const catName = (categoryName ?? '').trim()
    const accName = (accountName ?? '').trim()
    const amt = Number(String(amount).replace(/[^0-9]/g, '')) || 0

    // 1) account 찾기 (없으면 생성)
    const { data: accRow, error: accSelErr } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', accName)
      .maybeSingle()
    if (accSelErr) throw accSelErr

    let account_id = accRow?.id
    if (!account_id) {
      const { data: accIns, error: accInsErr } = await supabase
        .from('accounts')
        .insert([{ user_id: user.id, name: accName }])
        .select('id')
        .single()
      if (accInsErr) throw accInsErr
      account_id = accIns.id
    }

    // 2) category 찾기 (없으면 생성) — 카테고리에는 type 필요
    const { data: catRow, error: catSelErr } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', catName)
      .maybeSingle()
    if (catSelErr) throw catSelErr

    let category_id = catRow?.id
    if (!category_id) {
      const { data: catIns, error: catInsErr } = await supabase
        .from('categories')
        .insert([{ user_id: user.id, name: catName, type: dbType }])
        .select('id')
        .single()
      if (catInsErr) throw catInsErr
      category_id = catIns.id
    }

    // 3) transactions에 insert (amount는 양수 보관, type으로 수입/지출 구분)
    const { error: insErr } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        date,                 // 'YYYY-MM-DD'
        type: dbType,         // 'income' | 'expense'
        amount: amt,          // 양수
        category_id,
        account_id,
        description: (description ?? '').trim() || null,
        memo: (memo ?? '').trim() || null,
      }])
    if (insErr) throw insErr

    // 4) 캐시 리프레시 (해당 월만)
    const d = new Date(date)
    await get().fetchMonth(d.getFullYear(), d.getMonth() + 1, { force: true })
  },

  // 월별 데이터 fetch (읽기는 뷰 사용)
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
        .select('id, date, type, amount, category, account, description, user_id')
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
