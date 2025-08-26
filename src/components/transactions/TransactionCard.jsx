import { Minus, Plus } from 'lucide-react'

export default function TransactionCard({
  title,
  category,
  amount,
  date,
  account,
  memo,
  work,
  variant,
}) {
  const isNegative = Number(amount.replace(/,/g, '')) < 0
  const isDashboard = variant === 'dashboard'
  const isTransaction = variant === 'transaction'

  return (
    <div
      className={`items-center flex gap-24 border-b ${isDashboard && 'justify-between'} border-gray-100 ${isDashboard ? 'p-6' : 'p-4'}`}
    >
      {isTransaction && <div className="text-sm text-gray-500">{date}</div>}

      <div className={`flex items-center  ${isDashboard ? 'gap-0' : 'gap-24'}`}>
        {
          (isNegative ? (
            <Minus className="bg-red-100 text-red-500 w-8 h-8 rounded-sm p-1.5" />
          ) : (
            <Plus className="bg-green-100 text-green-500 w-8 h-8 rounded-sm p-1.5" />
          ))}

        <div className="flex flex-col">
          <div>{title}</div>
          <div className="text-sm text-gray-500 ml-10 w-16">{category}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className={`w-28 text-end ${
            Number(amount.replace(/,/g, '')) > 0 ? 'text-green-500' : 'text-red-500'
          } `}
        >
          {amount}원
        </div>

        {isDashboard && <div className="text-sm text-gray-500 text-end">{date}</div>}
      </div>
       {isTransaction && <div className='min-w-16 ml-8 text-sm'>{account}</div>}
       {isTransaction && <div className='min-w-24 ml-4 text-sm text-gray-500'>{memo}</div>}
       {isTransaction && <div>{work}</div>}
    </div>
  )
}
