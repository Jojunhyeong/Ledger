import TransactionCard from './TransactionCard'

export default function TransactionTable() {
  const headers = [
    { key: 'date', label: '날짜', width: 'w-30' },
    { key: 'type', label: '유형', width: 'w-28' },
    { key: 'category', label: '카테고리', width: 'w-30' },
    { key: 'amount', label: '금액', width: 'w-28 mr-20 text-right' },
    { key: 'account', label: '계정', width: 'w-32' },
    { key: 'memo', label: '메모', width: 'w-32' },
    { key: 'work', label: '작업', width: 'w-16 text-center' },
  ]
  const transaction = [
    {
      id: 1,
      category: '식비',
      description: '점심식사',
      amount: '-25,000',
      date: '2025-01-15',
      account: '신한카드',
      memo: '점심식사',
      work: '🗑️',
    },
    {
      id: 2,
      category: '급여',
      description: '1월 급여',
      amount: '+3,000,000',
      date: '2025-01-14',
      account: '급여통장',
      memo: '1월 급여',
      work: '🗑️',
    },
    {
      id: 3,
      category: '교통비',
      description: '지하철',
      amount: '15,000',
      date: '2025-01-13',
      account: '체크카드',
      memo: '지하철',
      work: '🗑️',
    },
    {
      id: 4,
      category: '생활용품',
      description: '마트 장보기',
      amount: '-45,000',
      date: '2025-01-12',
      memo: '마트 장보기',
      account: '신한카드',
      work: '🗑️',
    },
  ]
  return (
    <div className="w-296  overflow-auto mt-10 bg-white rounded-lg flex flex-col border border-gray-200">
      <div className="text-lg font-normal mt-4 ml-4 mb-4">거래 내역</div>

      <div className="flex flex-col">
        <div className="flex bg-gray-100 gap-12">
          {headers.map((h) => (
            <div key={h.key} className={`${h.width} px-4 py-2`}>
              {h.label}
            </div>
          ))}
        </div>
        {transaction.map((t) => (
          <TransactionCard
            key={t.id}
            title={t.title}
            category={t.category}
            description={t.description}
            amount={t.amount}
            date={t.date}
            account={t.account}
            memo={t.memo}
            variant={'transaction'}
            work={t.work}
          />
        ))}
      </div>
    </div>
  )
}
