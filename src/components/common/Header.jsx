import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className="w-full bg-white flex justify-between items-center pt-4 pb-4">
      <div className="text-xl ml-10">가계부</div>
      <div className='flex gap-10 mr-10'>
        <Link to="/dashboard" className='text-sm underline underline-offset-8 decoration-2 text-blue-500'>대시보드</Link>
        <Link to="/transaction" className='text-sm text-gray-500'>거래</Link>
        <Link to="" className='text-sm text-gray-500'>예산</Link>
        <Link to="" className='text-sm text-gray-500'>설정</Link>
      </div>
    </div>
  )
}
