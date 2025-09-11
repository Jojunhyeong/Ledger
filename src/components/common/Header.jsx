import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'

export default function Header() {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <>
      {/* 데스크톱 전용 헤더 (위쪽) */}
      <div className="hidden md:flex w-full bg-white justify-between items-center pt-4 pb-4">
        <div className="text-xl ml-10">가계부</div>
        <div className="flex gap-10 mr-10">
          <Link to="/dashboard" className="text-sm underline underline-offset-8 decoration-2 text-blue-500">대시보드</Link>
          <Link to="/transaction" className="text-sm text-gray-500">거래</Link>
          <Link to="/budget" className="text-sm text-gray-500">예산</Link>
          <Link to="" className="text-sm text-gray-500">설정</Link>
          <Link to="/signin" onClick={signOut} className="text-red-500">로그아웃</Link>
        </div>
      </div>

      {/* 모바일 전용 헤더 (아래쪽 탭바 느낌) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white shadow-black flex justify-around items-center h-14">
        <Link to="/transaction" className="text-sm text-gray-500">거래</Link>
        <Link to="/budget" className="text-sm text-gray-500">예산</Link>
         <Link to="/dashboard" className="text-sm text-blue-500">대시보드</Link>
        <Link to="/settings" className="text-sm text-gray-500">설정</Link>
        <button onClick={signOut} className="text-red-500 text-sm">로그아웃</button>
      </div>
    </>
  )
}
