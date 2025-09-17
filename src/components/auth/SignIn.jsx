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

  const handleSignIn = async (e) => {
    e?.preventDefault();   //  폼 제출 시 새로고침 방지
    if (loading) return;              //  가드 먼저
    setLoading(true);
    setMsg("");

    try {
      await signIn(email, pw);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMsg(`로그인 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen bg-blue-50 flex items-center">
      <div className="w-full max-w-sm mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleSignIn}
          className="flex flex-col items-center px-6 pb-10 border rounded-2xl shadow-2xl border-gray-50 bg-gray-50"
        >
          <img className="w-16 mt-10 bg-blue-100 rounded-full" src="/moneyplan.png" alt="" />
          <div className="mt-4 text-2xl font-semibold">머니플랜</div>
          <div className="text-gray-500 mt-2 text-sm">계정에 로그인하세요</div>

          <div className="flex flex-col items-start w-full mt-8 gap-2">
            <label htmlFor="email" className="text-xs">이메일 주소</label>
            <input
              id="email"
              type="email"
              placeholder=" ✉️    이메일을 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start w-full mt-5 gap-2">
            <label htmlFor="password" className="text-xs">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder=" 🔒    비밀번호를 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>

          <button
            type="submit"   // ✅ submit 타입으로 변경
            disabled={loading}
            className="bg-blue-500 text-white text-sm py-3 rounded w-full mt-5 disabled:opacity-50"
          >
            {loading ? "처리 중..." : "로그인"}
          </button>

          {msg && <div className="mt-3 text-sm text-red-500">{msg}</div>}

          <div className="flex gap-1 mt-5 text-sm">
            <span className="text-gray-500">계정이 없으신가요?</span>
            <button type="button" onClick={() => navigate("/signup")} className="text-blue-500">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}