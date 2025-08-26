import TransactionCard from './TransactionCard'

export default function TransactionList() {
  const transaction = [
    { id: 1, category: '식비', description: '점심식사', amount: '-25,000', date: '2025-01-15' },
    { id: 2, category: '급여', description: '1월 급여', amount: '+3,000,000', date: '2025-01-14' },
    { id: 3, category: '교통비', description: '지하철', amount: '+15,000', date: '2025-01-13' },
    {
      id: 4,
      category: '생활용품',
      description: '마트 장보기',
      amount: '-45,000',
      date: '2025-01-12',
    },
  ]
  return (
    <div className="w-296  overflow-auto mt-10 bg-white rounded-lg flex flex-col ">
      <div className="text-lg font-normal mt-4 ml-4">최근 거래</div>
      <div className="flex flex-col">
        {transaction.map((t) => (
          <TransactionCard
            key={t.id}
            title={t.tile}
            category={t.category}
            description={t.description}
            amount={t.amount}
            date={t.date}
            variant={'dashboard'}
          />
        ))}
      </div>
    </div>
  )
}
