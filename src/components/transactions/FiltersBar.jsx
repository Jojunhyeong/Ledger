import { useState } from 'react'

export default function FiltersBar() {
  const titles = ['전체', '수입', '지출']
  const categories = ['전체', '식비', '교통비', '생활용품', '카페', '의료비', '쇼핑', '문화생활']
  const accounts = ['전체', '신용카드', '체크카드', '급여통장', '적금통장']

  // 각각 독립 상태로 (한 state로 묶으면 셀렉트들이 서로 덮어씀)
  const [type, setType] = useState('전체')
  const [category, setCategory] = useState('전체')
  const [account, setAccount] = useState('전체')
  const [q, setQ] = useState('')

  return (
    <section className="bg-white mt-6 rounded-lg px-4 py-6 shadow-sm">
      {/* 모바일: 세로, md+: 가로 */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        {/* 유형 */}
        <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-0">
          <label className="text-sm text-gray-500" htmlFor="filter-type">유형</label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-sm border border-gray-300 rounded-sm p-1.5 font-light w-full md:w-64"
          >
            {titles.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-0">
          <label className="text-sm text-gray-500" htmlFor="filter-category">카테고리</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-gray-300 rounded-sm p-1.5 font-light w-full md:w-64"
          >
            {categories.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 계정 */}
        <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-0">
          <label className="text-sm text-gray-500" htmlFor="filter-account">계정</label>
          <select
            id="filter-account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="text-sm border border-gray-300 rounded-sm p-1.5 font-light w-full md:w-64"
          >
            {accounts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* 검색 */}
        <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-0">
          <label className="text-sm text-gray-500" htmlFor="filter-query">검색</label>
          <input
            id="filter-query"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="🔍 메모 검색..."
            className="border border-gray-300 rounded-sm p-1.5 placeholder:text-sm placeholder:font-light w-full md:w-64"
          />
        </div>
      </div>
    </section>
  )
}
