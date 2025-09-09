import { useNavigate } from "react-router-dom"

export default function SignUp() {
    const navigate = useNavigate();
       return (
    <div className="bg-green-50 w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col  items-center px-6 pb-10  border rounded-2xl shadow-2xl border-gray-50 bg-gray-50">
            <img className="w-15 mt-10 bg-green-100 rounded-full" src="/src/assets/moneyplan.png" alt="" />
            <div className="mt-4 text-2xl font-semibold">회원가입</div>
            <div className="text-gray-500 mt-2 text-sm">새 계정을 만들어 보세요</div>

            <div className="flex flex-col items-start w-80 mt-8 gap-2">
                <label htmlFor="" className="text-xs">이름</label>
                <input type="text" placeholder=" 👤    이름을 입력하세요" className="border p-1 rounded w-80 border-gray-400 placeholder:text-xs"/>
            </div>

            <div className="flex flex-col items-start w-80 mt-5 gap-2">
                <label htmlFor="" className="text-xs">이메일 주소</label>
                <input type="text" placeholder=" ✉️    이메일을 입력하세요" className="border p-1 rounded w-80 border-gray-400 placeholder:text-xs"/>
            </div>


            <div className="flex flex-col items-start w-80 mt-5 gap-2">
                <label htmlFor="" className="text-xs">비밀번호</label>
                <input type="password" placeholder=" 🔒    비밀번호를 입력하세요"  className="placeholder:text-xs placeholder: border p-1 rounded w-80 border-gray-400"/>
            </div>

            <div className="flex flex-col items-start w-80 mt-5 gap-2">
                <label htmlFor="" className="text-xs">비밀번호 확인</label>
                <input type="password" placeholder=" 🔒    비밀번호를 다시 입력하세요"  className="placeholder:text-xs placeholder: border p-1 rounded w-80 border-gray-400"/>
            </div>

            <div className="flex mt-5 justify-between w-full">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" className=""/>
                    <div className="text-xs text-gray-500">이용약관과 개인정보 처리방침에 동의합니다.</div>
                </div>
              
            </div>

            <button className="bg-blue-500 text-white text-xs py-3 rounded w-full mt-5">회원가입</button>

            <div className="flex gap-1 mt-5 text-sm">
                <div className="text-gray-500">이미 계정이 있으신가요?</div>
                <button onClick={() => navigate("/signin")} className="text-green-500">로그인</button>
            </div>
        </div>
    </div>
  )
}