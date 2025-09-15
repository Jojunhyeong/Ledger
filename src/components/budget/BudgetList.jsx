import { Coffee, HeartPulse, ShoppingCart, TramFront, Utensils } from 'lucide-react'
import BudgetCard from './BudgetCard'
import { useBudgetStore } from '@/store/useBudgetStore'
import { useEffect } from 'react'
import { calcBudget } from '@/utils/calcBudget'

export default function BudgetList({editable}) {
  const { items, loading, fetchThisMonth, deleteBudget} = useBudgetStore()

  useEffect(() => {
    fetchThisMonth()
  }, [fetchThisMonth])

  const handleDelete = async(id) => {
    if(!window.confirm('이 예산을 삭제할까요?')) return
    try{
      await deleteBudget(id)
    } catch(e) {
      console.error(e)
      alrert('삭제에 실패했습니다.')
    }
  }


  return (
    <div className="md:w-296 md:px-0 px-4 mx-auto mt-6 grid-cols-1 grid md:grid-cols-3 gap-6">
      {items.map((b) => {
        const { remain, pct } = calcBudget(b.limit_amount, b.used_amount)
        return (
          <BudgetCard
          editable={editable}
            key={b.budget_id}
            icon={Utensils}
            name={b.category_name}
            limit={b.limit_amount}
            used={b.used_amount}
            remain={remain}
            pct={pct}
            onDelete={() => handleDelete(b.budget_id)}
          />
        )
      })}
    </div>
  )
}
