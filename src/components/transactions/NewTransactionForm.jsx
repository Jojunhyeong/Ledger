import { useState } from 'react'

export default function NewTransactionForm() {
  const date = ['2025.01.15']
  const type = ['수입', '지출']
  const category = ['식비', '교통비', '생활용품', '카페', '의료비', '쇼핑', '기타']
  const account = ['신한카드', '체크카드', '급여통장', '적금통장']

  const [selected, setSelected] = useState()

  return (
    <div className="flex flex-col">
      <div className="bg-white w-296  mt-6 rounded-lg p-6">
        <div className="flex gap-10 mb-8">
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              날짜
            </label>
            <select
              id="type"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {date.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              유형
            </label>
            <select
              id="type"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {type.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              금액
            </label>
            <input
              type="text"
              placeholder="금액을 입력하세요"
              className="border w-88 border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5"
            ></input>
          </div>
        </div>
        <div className="flex gap-10">
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              카테고리
            </label>
            <select
              id="type"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {category.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              계정
            </label>
            <select
              id="type"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="text-sm border w-88 border-gray-300 rounded-sm p-1.5 font-light"
            >
              {account.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="type">
              메모
            </label>
            <input
              type="text"
              placeholder="메모를 입력하세요"
              className="border w-88 border-gray-300 rounded-sm p-1 placeholder:text-sm placeholder:font-light placeholder:pl-1.5"
            ></input>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className='bg-gray-100  text-sm px-2 py-1 rounded-xs'>취소</button>
          <button className='bg-blue-500 text-white text-sm px-2 py-1 rounded-xs'>저장</button>
        </div>
      </div>
    </div>
  )
}
