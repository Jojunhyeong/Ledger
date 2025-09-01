import { useState } from 'react'
import { useLedgerStore } from '@/store/useLedgerStore'

export default function NewTransactionForm() {
  const addByNames = useLedgerStore((s) => s.addTransactionByNames)

  // 개별 상태
  const [date, setDate] = useState('2025-09-01') // 'YYYY-MM-DD' 권장
  const [type, setType] = useState('지출')        // '수입' | '지출' | 'income' | 'expense'
  const [amount, setAmount] = useState('')
  const [categoryName, setCategoryName] = useState('식비')
  const [accountName, setAccountName] = useState('신한카드')
  const [description, setDescription] = useState('')
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const typeOptions = ['수입', '지출']
  const categoryOptions = ['식비', '교통비', '생활용품', '카페', '의료비', '쇼핑', '기타']
  const accountOptions = ['신한카드', '체크카드', '급여통장', '적금통장']

  const onSave = async () => {
    if (!date) return alert('날짜를 선택하세요.')
    if (!amount) return alert('금액을 입력하세요.')
    if (!categoryName) return alert('카테고리를 선택하세요.')
    if (!accountName) return alert('계정을 선택하세요.')

    try {
      setSubmitting(true)
      await addByNames({
        date,
        type,         // ← 스토어에서 '수입/지출' ↔ 'income/expense' 매핑
        amount,
        categoryName,
        accountName,
        description,
        memo,
      })
      alert('저장되었습니다.')
      // 원한다면 폼 초기화
      // setAmount(''); setDescription(''); setMemo('')
    } catch (e) {
      console.error(e)
      alert(e?.message || '저장 중 오류가 발생했습니다.')
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
              {typeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
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
          {/* 카테고리 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="category">카테고리</label>
            <select
              id="category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {categoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* 계정 */}
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

        {/* 설명(선택) */}
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

        <div className="flex gap-3 mt-6 justify-end">
          <button
            disabled={submitting}
            className="bg-gray-100 text-sm px-2 py-1 rounded-xs disabled:opacity-50"
            onClick={() => {
              // 초기화 예시
              // setAmount(''); setDescription(''); setMemo('')
            }}
          >
            취소
          </button>
          <button
            disabled={submitting}
            onClick={onSave}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-xs disabled:opacity-50"
          >
            {submitting ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
