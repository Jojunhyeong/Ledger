import { useState } from 'react'

export default function FiltersBar() {
  const title = ['전체', '수입', '지출'];
  const category = ['전체', '식비', '교통비', '생활용품', '카페', '의료비', '쇼핑', '문화생활'];
  const account = ["전체", "신용카드", "체크카드", "급여통장", "적금통장"];

  const [selected, setSelected] = useState();

  return (
    <div className="bg-white w-296 h-25 mt-6 rounded-lg p-5">
      <div className="flex gap-10">
        <div className=" flex flex-col gap-1">
          <label className='text-sm text-gray-500' htmlFor="type">유형</label>
          <select id="type" value={selected} onChange={(e) => setSelected(e.target.value)} className='text-sm border w-64 border-gray-300 rounded-sm p-1.5 font-light'>
            {title.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className=" flex flex-col gap-1">
          <label className='text-sm text-gray-500' htmlFor="type">카테고리</label>
          <select id="type" value={selected} onChange={(e) => setSelected(e.target.value)} className='text-sm border w-64 border-gray-300 rounded-sm p-1.5 font-light'>
            {category.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className=" flex flex-col gap-1">
          <label className='text-sm text-gray-500' htmlFor="type">계정</label>
          <select id="type" value={selected} onChange={(e) => setSelected(e.target.value)} className='text-sm border w-64 border-gray-300 rounded-sm p-1.5 font-light'>
            {account.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className=" flex flex-col gap-1">
          <label className='text-sm text-gray-500' htmlFor="type">검색</label>
          <input type="text" placeholder="🔍 메모 검색..." className='border w-64 border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5'></input>
        
        </div>
      </div>
    </div>
  )
}
