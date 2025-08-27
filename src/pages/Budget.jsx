import BudgetCard from '@/components/budget/BudgetCard'
import BudgetList from '@/components/budget/BudgetList'

export default function Budget() {

  return (
    <div>
      <div className="flex justify-between w-296 mx-auto mt-6">
        <div className="text-2xl font-semibold">예산관리</div>
        <button className="bg-blue-500 text-white text-sm px-2.5 py-1.5 rounded-xs">
          + 새 예산 추가
        </button>
      </div>
      <BudgetList />
    </div>
  )
}
