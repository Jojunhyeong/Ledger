import { Minus, Plus } from 'lucide-react'

export default function TransactionCard({ title, category, amount, date }) {
  const isNegative = Number(amount.replace(/,/g, '')) < 0
  return (
    <div className="flex justify-between border-b border-gray-100 p-10">
      <div className="flex items-center gap-5">
        {isNegative ? (
          <Minus className="bg-red-100 text-red-500 w-8 h-8 rounded-sm p-1.5" />
        ) : (
          <Plus className="bg-green-100 text-green-500 w-8 h-8 rounded-sm p-1.5" />
        )}
        <div className="flex flex-col">
          <div>{title}</div>
          <div className="text-sm text-gray-500">{category}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className={`${
            Number(amount.replace(/,/g, '')) > 0 ? 'text-green-500' : 'text-red-500'
          } text-end`}
        >
          {amount}원
        </div>

        <div className="text-sm text-gray-500 text-end">{date}</div>
      </div>
    </div>
  )
}
