// src/components/dashboard/MonthNavigator.jsx
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MonthNavigator({ year, month, onChange }) {
  const prev = () => {
    const y = month === 1 ? year - 1 : year
    const m = month === 1 ? 12 : month - 1
    onChange?.(y, m)
  }
  const next = () => {
    const y = month === 12 ? year + 1 : year
    const m = month === 12 ? 1 : month + 1
    onChange?.(y, m)
  }

  return (
    <div className="flex items-center mt-6 md:gap-4 gap-20 rounded-xl py-2 px-2 md:bg-transparent bg-white">
      <button onClick={prev} aria-label="이전 달">
        <ChevronLeft className="w-6 h-6 text-gray-500 md:bg-transparent bg-gray-100 rounded-2xl "/>
      </button>
      <div className="text-xl font-semibold">
        {year}년 {month}월
      </div>
      <button onClick={next} aria-label="다음 달">
        <ChevronRight className="w-6 h-6 text-gray-500 md:bg-transparent bg-gray-100 rounded-2xl " />
      </button>
    </div>
  )
}
