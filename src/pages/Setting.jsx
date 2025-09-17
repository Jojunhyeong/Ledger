import BudgetCard from '@/components/budget/BudgetCard'
import BudgetList from '@/components/budget/BudgetList'
import NewBudgetForm from '@/components/budget/NewBudgetForm'
import SettingList from '@/components/setting/SettingList';
import { useState } from 'react';

export default function Setting() {


  return (

    <div>
      <div className="flex justify-between md:w-296 md:mx-auto md:px-0 md:pt-6 pt-20 px-6 flex-col">
        <div className="text-2xl font-semibold">설정</div>
        <SettingList/>
        
      </div>
   
    </div>

  )
}
