// src/repos/transactionsRepo.js
import { supabase } from "@/lib/supabaseClient"

// 로그인 확인 → uid 반환
const getUid = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')
  return user.id
}

// yyyymm(예: '2025-08')으로 해당 월 거래 조회
export async function listByMonth(yyyymm) {
  const uid = await getUid()
  // yyyymm 컬럼 비워둔 경우가 있으니 날짜 범위로 조회
  const from = `${yyyymm}-01`
  const to   = `${yyyymm}-31`
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', uid)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

// 이번 달 편의 함수
export async function listThisMonth() {
  const yyyymm = new Date().toISOString().slice(0, 7)
  return listByMonth(yyyymm)
}
