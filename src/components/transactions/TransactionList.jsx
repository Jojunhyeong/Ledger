import { useEffect, useMemo, useCallback } from 'react'
import { useLedgerStore } from '@/store/useTransactionStore'
import TransactionCard from './TransactionCard'
import { formatWon } from '@/utils/formatCurrency'

const pad2 = (n) => String(n).padStart(2, '0')

export default function TransactionList() {
  const year = useLedgerStore((s) => s.year)
  const month = useLedgerStore((s) => s.month)
  const fetchMonth = useLedgerStore((s) => s.fetchMonth)
  const loading = useLedgerStore((s) => s.loading)

  const key = `${year}-${pad2(month)}`
  // ❗ selector에서 새 참조 만들지 말 것 (|| [] 금지)
  const items = useLedgerStore(useCallback((s) => s.itemsByKey[key], [key]))
  const list = items ?? [] // ← 컴포넌트에서만 기본값 처리

  useEffect(() => {
    if (year && month) fetchMonth(year, month) // 캐시 있으면 스킵
  }, [year, month, fetchMonth])

  const rows = useMemo(() => {
    // 기존 limit(5)와 동일한 효과
    return list.slice(0, 5).map((t) => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: Number(t.amount) || 0,
      category: t.category,
    }))
  }, [list])

  return (
    <div className=" overflow-auto mt-10 bg-white rounded-lg flex flex-col">
      <div className="text-lg font-normal mt-4 ml-4">최근 거래</div>
      {loading && rows.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">불러오는 중…</div>
      ) : (
        <div className="flex flex-col">
          {rows.map((r) => {
            const signed = r.type === 'income' ? r.amount : -r.amount
            return (
              <TransactionCard
                key={r.id}
                category={r.category}
                amount={formatWon(signed)}
                date={r.date}
                variant="dashboard"
              />
            )
          })}
          {rows.length === 0 && (
            <div className="p-4 text-sm text-gray-500">이번 달 거래가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  )
}
