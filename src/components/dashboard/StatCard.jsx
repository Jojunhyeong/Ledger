import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'

export default function StatCard({ title, amount, rate, type }) {
  const amountColor =
    type === 'income' ? 'text-blue-500' : type === 'expense' ? 'text-red-500' : 'text-green-500'
  const rateColor =
    type === 'income' ? 'text-blue-500' : type === 'expense' ? 'text-red-500' : 'text-green-500'

  return (
    <div className="w-92 h-32 bg-white rounded-lg flex flex-col items-start">
      <div className="text-sm mt-4 ml-4">{title}</div>
      <div className="flex items-center gap-40">
        <div className={`mt-2 ml-4 text-2xl font-semibold ${amountColor}`}>{amount}</div>
        {type === 'income' ? (
          <ArrowUp className="bg-blue-100 text-blue-500 w-8 h-8 rounded-sm p-1.5" />
        ) : type === 'expense' ? (
          <ArrowDown className="bg-red-100 text-red-500 w-8 h-8 rounded-sm p-1.5" />
        ) : (
          <Wallet className="bg-green-100 text-green-500 w-8 h-8 rounded-sm p-1.5" />
        )}
      </div>
      <div className="flex mt-2 ml-4 gap-2">
        <div className={`text-sm ${rateColor}`}>{rate}</div>
        <div className="text-sm text-gray-500">전월 대비</div>
      </div>
    </div>
  )
}
