// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setMsg("");
    try {
      await signIn(email, pw); 
       navigate("/dashboard"); // 성공 시 이동
    } catch (err) {
      console.error(err);
      setMsg(`로그인 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center px-6 pb-10 border rounded-2xl shadow-2xl border-gray-50 bg-gray-50">
        <img
          className="w-15 mt-10 bg-blue-100 rounded-full"
          src="/src/assets/moneyplan.png"
          alt=""
        />
        <div className="mt-4 text-2xl font-semibold">가계부</div>
        <div className="text-gray-500 mt-2 text-sm">계정에 로그인하세요</div>

        <div className="flex flex-col items-start w-80 mt-8 gap-2">
          <label className="text-xs">이메일 주소</label>
          <input
            type="text"
            placeholder=" ✉️    이메일을 입력하세요"
            className="border p-1 rounded w-80 border-gray-400 placeholder:text-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start w-80 mt-5 gap-2">
          <label className="text-xs">비밀번호</label>
          <input
            type="password"
            placeholder=" 🔒    비밀번호를 입력하세요"
            className="placeholder:text-xs border p-1 rounded w-80 border-gray-400"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>

        <div className="flex mt-5 justify-between w-full">
          <div className="flex gap-2 items-center">
            <input type="checkbox" />
            <div className="text-xs text-gray-500">로그인 상태 유지</div>
          </div>
          {/* <div className="text-xs text-blue-500">비밀번호 찾기</div> */}
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="bg-blue-500 text-white text-xs py-3 rounded w-full mt-5"
        >
          {loading ? "처리 중..." : "로그인"}
        </button>

        {msg && <div className="mt-3 text-sm text-red-500">{msg}</div>}

        <div className="flex gap-1 mt-5 text-sm">
          <div className="text-gray-500">계정이 없으신가요?</div>
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
