import { useEffect, useMemo, useCallback } from 'react'
import { useLedgerStore } from '@/store/useLedgerStore'
import { formatWon } from '@/utils/formatCurrency'
import TransactionCard from './TransactionCard'

export default function TransactionTable() {
  const pad2 = (n) => String(n).padStart(2, '0')

  const year = useLedgerStore((s) => s.year)
  const month = useLedgerStore((s) => s.month)
  const fetchMonth = useLedgerStore((s) => s.fetchMonth)
  const loading = useLedgerStore((s) => s.loading)

  const deleteTransaction = useLedgerStore((s) => s.deleteTransaction)

  const key = `${year}-${pad2(month)}`
  // selector는 원본만 반환 (|| [] 금지). 기본값은 아래에서 처리
  const items = useLedgerStore(useCallback((s) => s.itemsByKey[key], [key]))
  const list = items ?? []

  useEffect(() => {
    if (year && month) fetchMonth(year, month) // 캐시 있으면 내부에서 스킵
  }, [year, month, fetchMonth])

  const rows = useMemo(() => {
    return list.map((t) => {
      const n = Number(t.amount) || 0
      const signed = t.type === 'income' ? n : -n // 표시용 부호
      return {
        id: t.id,
        date: t.date,
        type: t.type,
        amount: signed,
        category: t.category,
        description: t.description,
        memo: t.memo,
        account: t.account,
      }
    })
  }, [list])

  const handleDelete = useCallback(
    async (id, date) => {
      const ok = window.confirm('이 거래를 삭제할까요?')
      if (ok) {
        try {
          await deleteTransaction({ id, date })
        } catch (e) {
          console.error(e)
          alert('삭제에 실패했습니다.')
        }
      }
    },
    [deleteTransaction]
  )

  const headers = [
    { key: 'date', label: '날짜', className: 'w-30' },
    { key: 'type', label: '유형', className: 'w-28' },
    { key: 'category', label: '카테고리', className: 'w-30' },
    { key: 'amount', label: '금액', className: 'w-28 mr-20 text-right' },
    { key: 'account', label: '계정', className: 'w-32' },
    { key: 'memo', label: '메모', className: 'w-32' },
    { key: 'work', label: '작업', className: 'w-16 text-center' },
  ]

  return (
    <div className="w-296 overflow-auto mt-10 bg-white rounded-lg flex flex-col border border-gray-200">
      <div className="text-lg font-normal mt-4 ml-4 mb-4">거래 내역</div>

      <div className="flex flex-col">
        <div className="flex bg-gray-100 gap-12">
          {headers.map((h) => (
            <div key={h.key} className={`${h.className} px-4 py-2`}>
              {h.label}
            </div>
          ))}
        </div>

        {loading && rows.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">불러오는 중…</div>
        ) : (
          rows.map((r) => (
            <TransactionCard
              key={r.id}
              category={r.category}
              description={r.description}
              amount={formatWon(r.amount)}
              date={r.date}
              account={r.account}
              memo={r.memo}
              variant="transaction"
              onDelete={() => handleDelete(r.id, r.date)}
              // work prop이 필요하면 여기에서 전달
            />
          ))
        )}

        {!loading && rows.length === 0 && (
          <div className="p-4 text-sm text-gray-500">표시할 거래가 없습니다.</div>
        )}
      </div>
    </div>
  )
}
