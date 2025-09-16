import { useAuthStore } from '@/store/useAuthStore'
import { NavLink, Link } from 'react-router-dom'

export default function Header() {
  const signOut = useAuthStore((s) => s.signOut);

  // 공통 클래스
  const base = 'text-sm transition-colors';
  const active = 'text-blue-500 underline underline-offset-8 decoration-2';
  const inactive = 'text-gray-500';

  const navClass = ({ isActive }) => `${base} ${isActive ? active : inactive}`;

  return (
    <>
      {/* 데스크톱 전용 헤더 (위쪽) */}
      <div className="hidden md:flex w-full bg-white justify-between items-center pt-4 pb-4">
        <div className="text-xl ml-10">가계부</div>
        <div className="flex gap-10 mr-10">
          <NavLink to="/dashboard" className={navClass} end>
            대시보드
          </NavLink>
          <NavLink to="/transaction" className={navClass}>
            거래
          </NavLink>
          <NavLink to="/budget" className={navClass}>
            예산
          </NavLink>
          <Link to="/signin" onClick={signOut} className="text-red-500 text-sm">
            로그아웃
          </Link>
        </div>
      </div>

      {/* 모바일 전용 헤더 (위쪽) */}
      <div className="flex md:hidden w-full fixed top-0 bg-white justify-center items-center pt-4 pb-4">
        <div className="text-xl">가계부</div>
      </div>

      {/* 모바일 전용 헤더 (아래쪽 탭바 느낌) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white shadow-black flex justify-around items-center h-14">
        <NavLink to="/dashboard" className={navClass} end>
          대시보드
        </NavLink>
        <NavLink to="/transaction" className={navClass}>
          거래
        </NavLink>
        <NavLink to="/budget" className={navClass}>
          예산
        </NavLink>
        <Link to="/signin" onClick={signOut} className="text-red-500 text-sm">
          로그아웃
        </Link>
      </div>
    </>
  )
}
