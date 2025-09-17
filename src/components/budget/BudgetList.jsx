// src/components/budget/BudgetList.jsx
import { useEffect } from 'react'
import BudgetCard from './BudgetCard'
import { useBudgetStore } from '@/store/useBudgetStore'
import { calcBudget } from '@/utils/calcBudget'
import { ICONS } from '@/constants/iconRegistry'

export default function BudgetList({ editable }) {
  const items = useBudgetStore((s) => s.items)
  const fetchThisMonth = useBudgetStore((s) => s.fetchThisMonth)
  const deleteBudget = useBudgetStore((s) => s.deleteBudget)

  useEffect(() => {
    fetchThisMonth()
  }, [fetchThisMonth])

  const handleDelete = async (id) => {
    if (!window.confirm('이 예산을 삭제할까요?')) return
    try {
      await deleteBudget(id)
    } catch (e) {
      console.error(e)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="md:w-296 md:px-0 px-4 mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((b) => {
        const { remain, pct } = calcBudget(b.limit_amount, b.used_amount)
        const Icon = ICONS[b.category_icon_key] ?? ICONS.wallet

        return (
          <BudgetCard
            key={b.budget_id}
            editable={editable}
            icon={Icon}
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
