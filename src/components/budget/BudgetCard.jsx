import { Trash, Utensils } from 'lucide-react'
import { formatWon } from '@/utils/formatCurrency'

export default function BudgetCard({ icon: Icon, name, limit, used, pct, editable, onDelete}) {
  const isOver = pct > 100
  return (
    <div
      className={`rounded-lg  p-6 md:p-6 flex flex-col gap-3 ${isOver ? 'bg-red-100  border border-red-300 ' : 'bg-white border-white'}`}
    >
      <div className="flex gap-3 items-center">
        {Icon ? (
          <Icon
            className={`w-8 h-8 rounded-sm p-1.5 ${isOver ? 'bg-red-200 text-red-500 ' : 'bg-blue-100 text-blue-500 '}`} />
        ) : null}

        <div className='whitespace-nowrap w-10'>{name}</div>
        {editable && <Trash onClick={onDelete} className='ml-56 md:ml-54 w-4'/>}
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">사용액</div>
        <div className="text-sm">{formatWon(used)}원</div>
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">예산</div>
        <div className="text-sm">{formatWon(limit)}원</div>
      </div>
      <div className=" flex justify-between">
        <div className="text-sm text-gray-500">진행률</div>
        <div
          className={`text-sm ${isOver ? 'text-red-500' : pct >= 70 ? 'text-orange-500' : 'text-green-500'}`}
        >
          {pct}%
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className={`h-full bg-green-500 ${isOver ? 'bg-red-500' : pct >= 70 ? 'bg-orange-500' : 'bg-green-500'} rounded-lg`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      {isOver && (
        <div className="text-xs text-red-700 bg-red-200 h-8 rounded-lg flex items-center ">
          <div className='ml-5'>‼️ 예산을 {formatWon(used - limit)}원 초과했습니다.</div>
        </div>
      )}
    </div>
  )
}
