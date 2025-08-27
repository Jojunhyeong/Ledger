import { Utensils } from 'lucide-react'
import { formatWon } from '@/utils/formatCurrency'

export default function BudgetCard({ icon: Icon, title, expense, budget, progress }) {
  const isOver = progress > 100
  return (
    <div
      className={`rounded-lg  w-92  p-5 flex flex-col gap-3 ${isOver ? 'bg-red-100  border border-red-300 ' : 'bg-white border-white'}`}
    >
      <div className="flex gap-3 items-center">
        {Icon && (
          <Icon
            className={`w-8 h-8 rounded-sm p-1.5 ${isOver ? 'bg-red-200 text-red-500 ' : 'bg-blue-100 text-blue-500 '}`}
          />
        )}

        <div>{title}</div>
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">사용액</div>
        <div className="text-sm">{formatWon(expense)}원</div>
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">예산</div>
        <div className="text-sm">{formatWon(budget)}원</div>
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">진행률</div>
        <div
          className={`text-sm ${isOver ? 'text-red-500' : progress >= 70 ? 'text-orange-500' : 'text-green-500'}`}
        >
          {progress}%
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className={`h-full bg-green-500 ${isOver ? 'bg-red-500' : progress >= 70 ? 'bg-orange-500' : 'bg-green-500'} rounded-lg`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {isOver && (
        <div className="text-xs text-red-700 bg-red-200 h-8 rounded-lg flex items-center ">
          <div className='ml-5'>‼️ 예산을 {formatWon(expense - budget)}원 초과했습니다.</div>
        </div>
      )}
    </div>
  )
}
