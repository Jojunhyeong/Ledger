import { useEffect, useMemo, useState } from 'react'
import { useTransactionStore } from '@/store/useTransactionStore'
import { useCategoryStore } from '@/store/useCategoryStore'

const toDbType = (v) => {
  if (v === '수입' || v === 'income') return 'income'
  if (v === '지출' || v === 'expense') return 'expense'
  return 'expense'
}

export default function NewTransactionForm() {
  const addTx = useTransactionStore((s) => s.addTransactionByNames)
  const { items: categories, fetchAll: fetchCats } = useCategoryStore()

  // form state
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const [type, setType] = useState('지출')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountName, setAccountName] = useState('신용카드')
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const accountOptions = ['신용카드', '체크카드', '급여통장', '적금통장']

  useEffect(() => {
    fetchCats()
  }, [fetchCats])

  const onSave = async () => {
    if (!date) return alert('날짜를 선택하세요.')
    const amt = parseInt(String(amount).replace(/[^\d-]/g, ''), 10) || 0
    if (!amt) return alert('금액을 입력하세요.')
    if (!categoryId) return alert('카테고리를 선택하세요.')
    if (!accountName) return alert('계정을 선택하세요.')

    try {
      setSubmitting(true)
      await addTx({
        date,
        type: toDbType(type),
        amount: amt,
        categoryName: categories.find((c) => c.id === categoryId)?.name || '',
        accountName,
        memo: memo?.trim() || null,
      })
      alert('저장되었습니다.')
    } catch (e) {
      console.error(e)
      alert(e?.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col px-4 md:px-0 md:w-295">
      <div className="bg-white mt-6 rounded-lg p-5 md:p-6">
        {/* ✅ grid 버전: md부터 3열, 모바일은 2열 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 mb-8">
          {/* 날짜 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="date">
              날짜
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm p-1.5 font-light min-w-0 md:min-w-0"
            />
          </div>

          {/* 유형 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              유형
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm p-1.5 font-light min-w-0 md:min-w-0"
            >
              <option value="수입">수입</option>
              <option value="지출">지출</option>
            </select>
          </div>

          {/* 금액 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="amount">
              금액
            </label>
            <input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액을 입력하세요"
              className="border border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5 min-w-0 md:min-w-0"
            />
          </div>

          {/* 카테고리 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="category">
              카테고리
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm p-1.5 font-light min-w-0 md:min-w-0"
            >
              <option value="">선택하세요</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 계정 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="account">
              계정
            </label>
            <select
              id="account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm p-1.5 font-light min-w-0 md:min-w-0"
            >
              {accountOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="memo">
              메모
            </label>
            <input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요"
              className="border border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5 min-w-0 md:min-w-0"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between gap-6">
          <div className='flex gap-3 md:hidden'>
          <div>💡</div>
          <div className='text-xs text-gray-500'> 💡새로운 카테고리는 설정에서 추가할 수 있어요.</div>
          </div>
          <div className='md:flex hidden'>
          <div className='text-xs text-gray-500'> 💡 새로운 카테고리는 설정에서 추가할 수 있어요.</div>
          </div>
          <div className='gap-3 flex'>
          <button
            disabled={submitting}
            className="bg-gray-100 text-sm px-2 py-1 rounded-xs disabled:opacity-50 whitespace-nowrap h-7"
          >
            취소
          </button>
          <button
            disabled={submitting}
            onClick={onSave}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-xs disabled:opacity-50 whitespace-nowrap h-7"
          >
            {submitting ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}
