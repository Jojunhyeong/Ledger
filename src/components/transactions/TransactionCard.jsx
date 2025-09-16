import { Minus, Plus } from 'lucide-react'

export default function TransactionCard({
  id,
  category,
  amount,
  date,
  account,
  memo,
  variant,
  onDelete,
}) {
  const numericAmount = Number(String(amount).replace(/,/g, ''))
  const isNegative = numericAmount < 0
  const isDashboard = variant === 'dashboard'
  const isTransaction = variant === 'transaction'

  return (
    <>
      {/* 데스크탑 전용 */}
      <div
        className={`hidden md:flex items-center md:gap-24 gap-6 border-b ${
          isDashboard && 'justify-between md:gap-220'
        } border-gray-100 ${isDashboard ? 'md:p-6 py-3 px-7' : 'p-4'}`}
      >
        {isTransaction && <div className="text-sm text-gray-500 md:w-22">{date}</div>}

        <div className={`flex items-center ${isDashboard ? 'gap-0' : 'md:gap-24'}`}>
          {/* 데스크탑 아이콘 */}
          {isNegative ? (
            <Minus className="hidden md:flex bg-red-100 text-red-500 w-8 h-8 rounded-sm p-1.5" aria-hidden />
          ) : (
            <Plus className="hidden md:flex bg-green-100 text-green-500 w-8 h-8 rounded-sm p-1.5" aria-hidden />
          )}

          <div className="flex flex-col">
            <div className="text-sm text-start text-gray-500 md:ml-7 whitespace-nowrap md:w-16 truncate">
              {category}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className={`w-28 text-end ${
              numericAmount > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {amount}원
          </div>
          {isDashboard && <div className="text-xs md:text-sm text-gray-500 text-end">{date}</div>}
        </div>

        {isTransaction && <div className="whitespace-nowrap md:min-w-16 md:ml-7 text-sm">{account ?? '없음'}</div>}
        {isTransaction && (
          <div className="whitespace-nowrap md:w-21 md:ml-4 text-sm text-gray-500 truncate">{memo ?? '없음'}</div>
        )}
        {isTransaction && (
          <button type="button" onClick={onDelete} aria-label="삭제">
            🗑️
          </button>
        )}
      </div>

      {/* 모바일 전용 */}
      <div
        className={`md:hidden items-center flex md:gap-24 gap-6 border-b ${
          isDashboard && 'justify-between md:gap-220'
        } border-gray-100 ${isDashboard ? 'md:p-6 py-3 px-7' : 'p-4'}`}
      >
        <div className={`flex items-center ${isDashboard ? 'gap-4 mr-24' : 'md:gap-24'}`}>
          {/* ✅ 대시보드일 때 모바일에서도 아이콘 표시 */}
          {isDashboard &&
            (isNegative ? (
              <Minus className="flex md:hidden bg-red-100 text-red-500 w-7 h-7 rounded-sm p-1.5" aria-hidden />
            ) : (
              <Plus className="flex md:hidden bg-green-100 text-green-500 w-7 h-7 rounded-sm p-1.5" aria-hidden />
            ))}

          <div className="flex flex-col">
            {isTransaction && (
              <div className="text-sm text-gray-500 md:w-22 whitespace-nowrap">{date}</div>
            )}
            <div className="text-sm text-center text-gray-500 md:ml-7 whitespace-nowrap md:w-16 w-16 truncate">
              {category}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className={`w-28 text-end ${
              numericAmount > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {amount}원
          </div>
           {isTransaction && <div className="whitespace-nowrap md:min-w-16 md:ml-7 text-gray-500 text-xs text-end">{account ?? '없음'}</div>}
          {isDashboard && <div className="text-xs md:text-sm text-gray-500 text-end">{date}</div>}
        </div>
        

        {isTransaction && (
          <div className="whitespace-nowrap md:min-w-21 md:ml-4 text-sm text-gray-500 max-w-22 truncate">{memo ?? '없음'}</div>
        )}
        {/* 트랜잭션 모바일에서 삭제 버튼 필요하면 주석 해제
        {isTransaction && (
          <button type="button" onClick={onDelete} aria-label="삭제">
            🗑️
          </button>
        )} */}
      </div>
    </>
  )
}
