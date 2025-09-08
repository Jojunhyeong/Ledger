import { create } from "zustand"
import { supabase } from "@/lib/supabaseClient"

const pad2 = (n) => String(n).padStart(2, "0")

// 월 범위 계산 (YYYY-MM-01 ~ YYYY-MM-말일)
const monthRange = (y, m) => {
  const last = new Date(y, m, 0).getDate() // m: 1~12
  const ym = `${y}-${pad2(m)}`
  return { from: `${ym}-01`, to: `${ym}-${pad2(last)}` }
}

const toDbType = (t) => {
  const v = String(t ?? "").trim().toLowerCase()
  if (v === "income" || v === "수입") return "income"
  if (v === "expense" || v === "지출") return "expense"
  throw new Error("type 값이 올바르지 않습니다. (수입/지출 또는 income/expense)")
}

export const useLedgerStore = create((set, get) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  loading: false,

  // 월별 캐시: { 'YYYY-MM': Array }
  itemsByKey: {},
  // 전체 목록 캐시
  itemsAll: [],

  setYearMonth: (y, m) => set({ year: y, month: m }),

  /**
   * 전체 거래 읽기 (누적, 최신이 위)
   * v_transactions_full 뷰는 category, account, description, memo 컬럼이 있다고 가정
   */
  fetchAll: async ({ force = false } = {}) => {
    if (!force && get().itemsAll.length > 0) return
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { set({ itemsAll: [], loading: false }); return }

      const { data, error } = await supabase
        .from("v_transactions_full")
        .select("id, date, type, amount, category, account, description, memo, user_id")
        .eq("user_id", user.id)
        .order("date", { ascending: false }) // 최신 날짜 먼저
        .order("id", { ascending: false })    // 같은 날짜에서 최근 입력 우선

      if (error) throw error
      set({ itemsAll: data ?? [], loading: false })
    } catch (e) {
      console.error("[fetchAll error]", e)
      set({ itemsAll: [], loading: false })
    }
  },

  /**
   * 특정 월만 읽기 (기존 화면 호환)
   */
  fetchMonth: async (y, m, { force = false } = {}) => {
    const key = `${y}-${pad2(m)}`
    if (!force && get().itemsByKey[key]) return

    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set((s) => ({ itemsByKey: { ...s.itemsByKey, [key]: [] }, loading: false }))
        return
      }

      const { from, to } = monthRange(y, m)
      const { data, error } = await supabase
        .from("v_transactions_full")
        .select("id, date, type, amount, category, account, description, memo, user_id")
        .eq("user_id", user.id)
        .gte("date", from)
        .lte("date", to)
        .order("date", { ascending: false })
        .order("id", { ascending: false })

      if (error) throw error

      set((s) => ({
        itemsByKey: { ...s.itemsByKey, [key]: data ?? [] },
        loading: false,
      }))
    } catch (e) {
      console.error("[fetchMonth error]", e)
      set((s) => ({ itemsByKey: { ...s.itemsByKey, [key]: [] }, loading: false }))
    }
  },

  /**
   * 이름 기반 추가: 계정/카테고리 없으면 만들고 transactions에 insert
   * (카테고리는 이름 하나로 통일 – kind 사용 안 함)
   */
  addTransactionByNames: async ({
    date, type, kind, amount, categoryName, accountName, description, memo,
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("로그인이 필요합니다.")

    const dbType = toDbType(kind ?? type)
    const catName = (categoryName ?? "").trim()
    const accName = (accountName ?? "").trim()
    const amt = Number(String(amount).replace(/[^0-9]/g, "")) || 0

    // 1) account 찾거나 생성
    const { data: accRow, error: accSelErr } = await supabase
      .from("accounts").select("id")
      .eq("user_id", user.id).eq("name", accName).maybeSingle()
    if (accSelErr) throw accSelErr
    let account_id = accRow?.id
    if (!account_id) {
      const { data: accIns, error: accInsErr } = await supabase
        .from("accounts")
        .insert([{ user_id: user.id, name: accName }])
        .select("id").single()
      if (accInsErr) throw accInsErr
      account_id = accIns.id
    }

    // 2) category 찾거나 생성 (이름만으로 보장)
    const { data: catRow, error: catSelErr } = await supabase
      .from("categories").select("id")
      .eq("user_id", user.id).eq("name", catName).maybeSingle()
    if (catSelErr) throw catSelErr

    let category_id = catRow?.id
    if (!category_id) {
      const { data: catIns, error: catInsErr } = await supabase
        .from("categories")
        .insert([{ user_id: user.id, name: catName }])
        .select("id").single()
      if (catInsErr) {
        // unique(user_id, name) 경쟁 시 재조회로 복구
        if (catInsErr.code === "23505") {
          const { data: again } = await supabase
            .from("categories").select("id")
            .eq("user_id", user.id).eq("name", catName).maybeSingle()
          category_id = again?.id
        } else {
          throw catInsErr
        }
      } else {
        category_id = catIns.id
      }
    }

    // 3) transactions insert (amount는 양수, type으로 수입/지출 구분)
    const { error: insErr } = await supabase
      .from("transactions")
      .insert([{
        user_id: user.id,
        date,
        type: dbType,       // 'income' | 'expense'
        amount: amt,        // 항상 양수
        category_id,
        account_id,
        description: (description ?? "").trim() || null,
        memo: (memo ?? "").trim() || null,
      }])
    if (insErr) throw insErr

    // 4) 캐시 갱신: 월/전체 둘 다
    const d = new Date(date)
    await Promise.all([
      get().fetchAll({ force: true }),
      get().fetchMonth(d.getFullYear(), d.getMonth() + 1, { force: true }),
    ])
  },

  deleteTransaction: async ({ id, date }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("로그인이 필요합니다.")
    if (!id) throw new Error("삭제할 id가 없습니다.")

    const { error } = await supabase
      .from("transactions").delete()
      .eq("id", id).eq("user_id", user.id)
    if (error) throw error

    // 캐시 갱신: 월/전체
    const d = date ? new Date(date) : null
    await Promise.all([
      get().fetchAll({ force: true }),
      d ? get().fetchMonth(d.getFullYear(), d.getMonth() + 1, { force: true }) : Promise.resolve(),
    ])
  },
}))
