import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { formatWon } from '@/utils/formatCurrency'
import TransactionCard from './TransactionCard'

const pad2 = (n) => String(n).padStart(2, '0')
const monthRange = (y, m) => {
  const last = new Date(y, m, 0).getDate() // m: 1~12
  const ym = `${y}-${pad2(m)}`
  return { from: `${ym}-01`, to: `${ym}-${pad2(last)}` }
}

export default function TransactionList({ year, month }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setItems([]); return }

        const { from, to } = monthRange(year, month)

        // ✅ error도 함께 구조분해
        const { data, error } = await supabase
          .from('v_transactions_full')
          .select('id, date, type, amount, category, description')
          .eq('user_id', user.id)
          .gte('date', from)
          .lte('date', to)
          .order('date', { ascending: false })
          .limit(5)

        if (error) throw error
        setItems(data ?? [])
      } catch (e) {
        console.error(e)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [year, month])

  return (
    <div className="w-296 overflow-auto mt-10 bg-white rounded-lg flex flex-col">
      <div className="text-lg font-normal mt-4 ml-4">최근 거래</div>
      {loading ? (
        <div className="p-4 text-sm text-gray-500">불러오는 중…</div>
      ) : (
        <div className="flex flex-col">
          {items.map((t) => {
            const signedAmount = t.type === 'income' ? t.amount : -t.amount
            return (
              <TransactionCard
                key={t.id}
                category={t.category}
                description={t.description}
                amount={formatWon(signedAmount)}
                date={t.date}
                variant="dashboard"
              />
            )
          })}
          {items.length === 0 && (
            <div className="p-4 text-sm text-gray-500">이번 달 거래가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  )
}
