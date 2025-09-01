import AuthDebug from '@/components/auth/AuthDebug'
import MonthNavigator from '@/components/dashboard/MonthNavigator'
import StatCard from '@/components/dashboard/StatCard'
import TransactionList from '@/components/transactions/TransactionList'
import { formatWon } from '@/utils/formatCurrency'
import { useState } from 'react'

export default function DashBoard() {
  const stats = [
    { id: 1, title: '이번 달 수입', amount: '3000000', rate: '+12.5%', type: 'income' },
    { id: 2, title: '이번 달 지출', amount: '1850000', rate: '+8.3%', type: 'expense' },
    { id: 3, title: '순수입', amount: '1150000', rate: '+15.2%', type: 'net' },
  ]
  
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const handleChange = (y, m) => {setYear(y); setMonth(m)}

  return (
    <div className="flex flex-col items-center">
      <MonthNavigator year={year} month={month} onChange={handleChange}/>
      <div className="flex gap-10 mt-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            amount={formatWon(stat.amount)}
            rate={stat.rate}
            type={stat.type}
          />
        ))}
      </div>
      <TransactionList year={year} month={month}/>
          <AuthDebug/>
    </div>
  )
}
