import BudgetCard from '@/components/budget/BudgetCard'
import BudgetList from '@/components/budget/BudgetList'
import NewBudgetForm from '@/components/budget/NewBudgetForm'
import { useState } from 'react';

export default function Budget() {
  const [open, setOpen] = useState(false);
  const [deleted, setDelete] = useState(false);

  return (

    <div>
      <div className="flex justify-between w-296 mx-auto mt-6">
        <div className="text-2xl font-semibold">예산관리</div>
        <div className='flex gap-2'>
          <button onClick={() => setOpen(true)} className="bg-blue-500 text-white text-sm px-2.5 py-1.5 rounded-xs">
          + 새 예산 추가
        </button>
        <button onClick={() => setDelete(!deleted)} className="bg-blue-500 text-white text-sm px-2.5 py-1.5 rounded-xs">
          편집
        </button>
        </div>
        
      </div>
      <BudgetList editable={deleted}/>

          <NewBudgetForm open={open} onClose={() => setOpen(false)}></NewBudgetForm>
    </div>

  )
}
