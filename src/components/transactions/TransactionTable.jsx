import { useEffect, useMemo } from "react"
import { useLedgerStore } from "@/store/useLedgerStore"
import { formatWon } from "@/utils/formatCurrency"
import TransactionCard from "./TransactionCard"

export default function TransactionTable() {
  const fetchAll = useLedgerStore((s) => s.fetchAll)
  const loading = useLedgerStore((s) => s.loading)
  const deleteTransaction = useLedgerStore((s) => s.deleteTransaction)
  const list = useLedgerStore((s) => s.itemsAll) ?? []

  useEffect(() => {
    fetchAll() // 캐시 있으면 내부에서 스킵
  }, [fetchAll])

  const rows = useMemo(() => {
    return list.map((t) => {
      const n = Number(t.amount) || 0
      const signed = t.type === "income" ? n : -n
      return {
        id: t.id,
        date: t.date,
        type: t.type,
        amount: signed,
        category: t.category,
     
        memo: t.memo,
        account: t.account,
      }
    })
  }, [list])

  const headers = [
    { key: "date", label: "날짜", className: "w-30 ml-6" },
    { key: "type", label: "유형", className: "w-28" },
    { key: "category", label: "카테고리", className: "w-30" },
    { key: "amount", label: "금액", className: "w-28 mr-20 text-right" },
    { key: "account", label: "계정", className: "w-32" },
    { key: "memo", label: "메모", className: "w-32" },
    { key: "work", label: "작업", className: "w-16 text-center" },
  ]

  const handleDelete = async (id, date) => {
    const ok = window.confirm("이 거래를 삭제할까요?")
    if (!ok) return
    try { await deleteTransaction({ id, date }) }
    catch (e) { console.error(e); alert("삭제에 실패했습니다.") }
  }

  return (
    <div className="md:px-3  overflow-auto mt-10 bg-white rounded-lg flex  flex-col border border-gray-200">
      <div className="text-lg font-normal mt-4 ml-4 mb-4">거래 내역</div>

      <div className="flex flex-col">
        <div className="md:flex bg-gray-100 md:gap-11 hidden">
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
        
              amount={formatWon(r.amount)}
              date={r.date}
              account={r.account}
              memo={r.memo}
              variant="transaction"
              onDelete={() => handleDelete(r.id, r.date)}
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
