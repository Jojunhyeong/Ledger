import { Coffee, HeartPulse, ShoppingCart, TramFront, Utensils } from 'lucide-react'
import BudgetCard from './BudgetCard'
import { useBudgetStore } from '@/store/useBudgetStore'
import { useEffect } from 'react'
import { calcBudget } from '@/utils/calcBudget'

export default function BudgetList() {
  const { items, loading, fetchThisMonth } = useBudgetStore()

  useEffect(() => {
    fetchThisMonth()
  }, [fetchThisMonth])

  const budgets = [
    { id: 1, icon: Utensils, title: '식비', expense: 320000, budget: 500000, progress: '64' },
    { id: 2, icon: TramFront, title: '교통비', expense: 95000, budget: 150000, progress: '63' },
    { id: 3, icon: ShoppingCart, title: '생활용품', expense: 180000, budget: 200000, progress: '90' },
    { id: 4, icon: Coffee, title: '카페', expense: 120000, budget: 100000, progress: '120' },
    { id: 5, icon: HeartPulse, title: '의료비', expense: 25000, budget: 100000, progress: '25' },
  ]

  return (
    <div className="w-296 mx-auto mt-6 grid grid-cols-3 gap-6">
      {items.map((b) => {
        const { remain, pct } = calcBudget(b.limit_amount, b.used_amount)
        return (
          <BudgetCard
            key={b.budget_id}
            icon={Utensils}
            name={b.category_name}
            limit={b.limit_amount}
            used={b.used_amount}
            remain={remain}
            pct={pct}
          />
        )
      })}
    </div>
  )
}
