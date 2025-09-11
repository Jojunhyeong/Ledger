import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'

export default function StatCard({ title, amount, rate, type }) {
  const amountColor =
    type === 'income' ? 'text-blue-500' : type === 'expense' ? 'text-red-500' : 'text-green-500'
  const rateColor =
    type === 'income' ? 'text-blue-500' : type === 'expense' ? 'text-red-500' : 'text-green-500'

  return (
    <div className="bg-white rounded-lg px-8 md:px-8 py-4 flex flex-col">
      {/* 제목 */}
      <div className="text-xs md:text-sm text-gray-600">{title}</div>

      {/* 금액 + 아이콘 */}
      <div className="flex items-center justify-between md:gap-38 gap-36 md:mt-2">
        <div className={`md:text-2xl font-semibold ${amountColor}`}>{amount}</div>
        {type === 'income' ? (
          <ArrowUp className="bg-blue-100 text-blue-500 w-8 h-8 rounded-sm p-1.5" />
        ) : type === 'expense' ? (
          <ArrowDown className="bg-red-100 text-red-500 w-8 h-8 rounded-sm p-1.5" />
        ) : (
          <Wallet className="bg-green-100 text-green-500 w-8 h-8 rounded-sm p-1.5" />
        )}
      </div>

      {/* 증감률 */}
      <div className="flex items-center gap-2 md:mt-2">
        <div className={`text-xs md:text-sm ${rateColor}`}>{rate}</div>
        <div className="text-xs md:text-sm text-gray-500">전월 대비</div>
      </div>
    </div>
  )
}
