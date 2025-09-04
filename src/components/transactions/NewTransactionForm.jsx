import { useEffect, useMemo, useState } from "react"
import { useLedgerStore } from "@/store/useLedgerStore"
import { useCategoryStore } from "@/store/useCategoryStore"

const toDbType = (v) => {
  if (v === "수입" || v === "income") return "income"
  if (v === "지출" || v === "expense") return "expense"
  return "expense"
}

export default function NewTransactionForm() {
  const addTx = useLedgerStore((s) => s.addTransaction) // id 기반 저장
  const { items: categories, fetchAll: fetchCats } = useCategoryStore()

  // form state
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const [type, setType] = useState("지출")
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [accountName, setAccountName] = useState("신한카드")
  const [description, setDescription] = useState("")
  const [memo, setMemo] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // account 고정 옵션 (로컬)
  const accountOptions = ["신한카드", "체크카드", "급여통장", "적금통장"]

  useEffect(() => { fetchCats() }, [fetchCats])

  const onSave = async () => {
    if (!date) return alert("날짜를 선택하세요.")
    const amt = parseInt(String(amount).replace(/[^\d-]/g, ""), 10) || 0
    if (!amt) return alert("금액을 입력하세요.")
    if (!categoryId) return alert("카테고리를 선택하세요.")
    if (!accountName) return alert("계정을 선택하세요.")

    try {
      setSubmitting(true)
      await addTx({
        date,
        type: toDbType(type),
        amount: amt,
        category_id: categoryId,   // store에서 가져온 id
        account_name: accountName, // 임시로 name만 저장
        description: description?.trim() || null,
        memo: memo?.trim() || null,
      })
      alert("저장되었습니다.")
      // 초기화 원하면 여기서 setAmount(""), setMemo("") 등
    } catch (e) {
      console.error(e)
      alert(e?.message || "저장 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-white w-296 mt-6 rounded-lg p-6">
        <div className="flex gap-10 mb-8">
          {/* 날짜 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="date">날짜</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            />
          </div>

          {/* 유형 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">유형</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              <option value="수입">수입</option>
              <option value="지출">지출</option>
            </select>
          </div>

          {/* 금액 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="amount">금액</label>
            <input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액을 입력하세요"
              className="border w-88 border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5"
            />
          </div>
        </div>

        <div className="flex gap-10">
          {/* 카테고리 (스토어 연동) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="category">카테고리</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              <option value="">선택하세요</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 계정 (로컬) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="account">계정</label>
            <select
              id="account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {accountOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="memo">메모</label>
            <input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요"
              className="border w-88 border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5"
            />
          </div>
        </div>

        {/* 설명 */}
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm text-gray-500" htmlFor="description">설명</label>
          <input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력하세요"
            className="border w-full border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6 justify-end">
          <button
            disabled={submitting}
            className="bg-gray-100 text-sm px-2 py-1 rounded-xs disabled:opacity-50"
            onClick={() => { /* 초기화 로직 원하면 추가 */ }}
          >
            취소
          </button>
          <button
            disabled={submitting}
            onClick={onSave}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-xs disabled:opacity-50"
          >
            {submitting ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  )
}
