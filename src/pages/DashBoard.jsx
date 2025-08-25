import MonthNavigator from '@/components/dashboard/MonthNavigator'
import StatCard from '@/components/dashboard/StatCard'
import TransactionList from '@/components/transactions/TransactionList'

export default function DashBoard() {
  const stats = [
    { id: 1, title: '이번 달 수입', amount: '3,000,000', rate: '+12.5%', type: 'income' },
    { id: 2, title: '이번 달 지출', amount: '1,850,000', rate: '+8.3%', type: 'expense' },
    { id: 3, title: '순수입', amount: '1,150,000', rate: '+15.2%', type: 'net' },
  ]

  return (
    <div className="flex flex-col items-center">
      <MonthNavigator />
      <div className="flex gap-10 mt-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            amount={stat.amount}
            rate={stat.rate}
            type={stat.type}
          />
        ))}
      </div>
      <TransactionList />
    </div>
  )
}
