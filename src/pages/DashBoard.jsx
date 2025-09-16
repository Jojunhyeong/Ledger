// /src/pages/DashBoard.jsx
import { useCallback, useEffect, useMemo } from 'react'
import MonthNavigator from '@/components/dashboard/MonthNavigator'
import StatCard from '@/components/dashboard/StatCard'
import TransactionList from '@/components/transactions/TransactionList'
import { formatWon } from '@/utils/formatCurrency'
import { useTransactionStore } from '@/store/useTransactionStore'

const pad2 = (n) => String(n).padStart(2, '0')
const prevMonth = (y, m) => (m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 })

const pctChange = (prev, curr) => {
  if (prev === 0) return curr === 0 ? 0 : null // null => N/A(표기: —)
  return ((curr - prev) / Math.abs(prev)) * 100
}
const fmtPct = (v) => (v === null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`)

export default function DashBoard() {
  // ✅ primitive 단위 개별 구독 (안정적)
  const year = useTransactionStore((s) => s.year)
  const month = useTransactionStore((s) => s.month)
  const setYearMonth = useTransactionStore((s) => s.setYearMonth)
  const fetchMonth = useTransactionStore((s) => s.fetchMonth)
  const loading = useTransactionStore((s) => s.loading)

  // 현재/이전 달 키
  const { y: py, m: pm } = prevMonth(year, month)
  const currKey = `${year}-${pad2(month)}`
  const prevKey = `${py}-${pad2(pm)}`

  // ✅ selector는 새 참조 만들지 말기 (|| [] 금지) → 이후에만 기본값 처리
  const itemsCurr = useTransactionStore(useCallback((s) => s.itemsByKey[currKey], [currKey]))
  const itemsPrev = useTransactionStore(useCallback((s) => s.itemsByKey[prevKey], [prevKey]))

  const listCurr = itemsCurr ?? []
  const listPrev = itemsPrev ?? []

  // 현재/이전 달을 모두 fetch (캐시 있으면 내부에서 스킵)
  useEffect(() => {
    fetchMonth(year, month)
    fetchMonth(py, pm)
  }, [year, month, py, pm, fetchMonth])

  // 합계 계산 유틸
  const calcTotals = (list) =>
    list.reduce(
      (acc, row) => {
        const amt = Number(row.amount) || 0
        if (row.type === 'income') acc.income += amt
        else acc.expense += Math.abs(amt)
        return acc
      },
      { income: 0, expense: 0 }
    )

  const totalsCurr = useMemo(() => calcTotals(listCurr), [listCurr])
  const totalsPrev = useMemo(() => calcTotals(listPrev), [listPrev])

  const netCurr = totalsCurr.income - totalsCurr.expense
  const netPrev = totalsPrev.income - totalsPrev.expense

  // 전월 대비 증감률
  const incomeRate = pctChange(totalsPrev.income, totalsCurr.income)
  const expenseRate = pctChange(totalsPrev.expense, totalsCurr.expense)
  const netRate = pctChange(netPrev, netCurr)

  const stats = [
    {
      id: 1,
      title: '이번 달 수입',
      amount: totalsCurr.income,
      rate: fmtPct(incomeRate),
      type: 'income',
    },
    {
      id: 2,
      title: '이번 달 지출',
      amount: totalsCurr.expense,
      rate: fmtPct(expenseRate),
      type: 'expense',
    },
    { id: 3, title: '순수입', amount: netCurr, rate: fmtPct(netRate), type: 'net' },
  ]

  return (
    <div className="flex flex-col items-center mt-14 md:mt-0">
      <MonthNavigator year={year} month={month} onChange={(y, m) => setYearMonth(y, m)} />

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4 md:mt-8 mt-4">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            amount={formatWon(s.amount)}
            rate={s.rate}
            type={s.type}
            loading={loading}
          />
        ))}
      </div>

      {/* 최근 거래 5건 */}
      <TransactionList year={year} month={month} />
    </div>
  )
}
