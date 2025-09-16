import { Trash } from 'lucide-react'
import { formatWon } from '@/utils/formatCurrency'

export default function BudgetCard({
  icon: Icon,
  name,
  limit,
  used,
  pct,
  editable,
  onDelete,
}) {
  const isOver = pct > 100
  const barPct = Math.min(pct, 100) // 게이지는 100%로 상한 두기

  return (
    <div
      className={`rounded-lg p-6 flex flex-col gap-3 ${
        isOver ? 'bg-red-100 border border-red-300' : 'bg-white border-white'
      }`}
    >
      {/* 헤더: 아이콘 + 이름 + (옵션) 삭제 버튼  */}
      <div className="flex items-center gap-3">
        {Icon ? (
          <Icon
            className={`shrink-0 w-8 h-8 rounded-sm p-1.5 ${
              isOver ? 'bg-red-200 text-red-500' : 'bg-blue-100 text-blue-500'
            }`}
          />
        ) : null}

        {/* 이름은 남은 너비만 사용하고 넘치면 말줄임 */}
        <div className="min-w-0 flex-1">
          <div className="truncate whitespace-nowrap font-medium">{name}</div>
        </div>

        {/* 편집일 때만 보이는 삭제 버튼: 오른쪽 정렬 + 줄어들지 않음 */}
        {editable && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto shrink-0 p-1 rounded hover:bg-red-50"
            aria-label="예산 삭제"
          >
            <Trash className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">사용액</div>
        <div className="text-sm">{formatWon(used)}원</div>
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">예산</div>
        <div className="text-sm">{formatWon(limit)}원</div>
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">진행률</div>
        <div
          className={`text-sm ${
            isOver ? 'text-red-500' : pct >= 70 ? 'text-orange-500' : 'text-green-500'
          }`}
        >
          {pct}%
        </div>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className={`h-full rounded-lg ${
            isOver ? 'bg-red-500' : pct >= 70 ? 'bg-orange-500' : 'bg-green-500'
          }`}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {isOver && (
        <div className="text-xs text-red-700 bg-red-200 h-8 rounded-lg flex items-center">
          <div className="ml-5">‼️ 예산을 {formatWon(used - limit)}원 초과했습니다.</div>
        </div>
      )}
    </div>
  )
}
