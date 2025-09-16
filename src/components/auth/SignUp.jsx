import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false); // 가입 완료 화면 전환

  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // 1) 클라이언트 유효성
    if (!name.trim()) return setErr("이름을 입력해 주세요.");
    if (!isEmail(email)) return setErr("이메일 형식이 올바르지 않습니다.");
    if (pw.length < 6) return setErr("비밀번호는 6자 이상이어야 합니다.");
    if (pw !== confirm) return setErr("비밀번호 확인이 일치하지 않습니다.");
    if (!agree) return setErr("이용약관과 개인정보 처리방침에 동의해 주세요.");

    setLoading(true);
    try {
      // 2) Supabase 회원가입
      const { error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          data: { full_name: name },
        },
      });
      if (error) throw error;

      // 3) 성공: 안내 화면으로 전환
      setDone(true);
    } catch (e) {
      const msg = e?.message || String(e);
      if (msg.includes("already registered")) {
        setErr("이미 가입된 이메일입니다. 로그인해 주세요.");
      } else {
        setErr(`회원가입에 실패했어요: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="border rounded-2xl shadow-2xl border-gray-50 bg-gray-50 p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <img className="w-15 mt-2 bg-green-100 rounded-full" src="/src/assets/moneyplan.png" alt="" />
              <h1 className="mt-4 text-2xl font-semibold">회원가입이 완료됐어요</h1>
              <button
                onClick={() => navigate("/signin", { replace: true })}
                className="bg-blue-500 text-white text-sm py-3 rounded w-full mt-6"
              >
                로그인 하러가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6">
        <form onSubmit={onSubmit} className="border rounded-2xl shadow-2xl border-gray-50 bg-gray-50 p-6 sm:p-8">
          <div className="flex flex-col items-center">
            <img className="w-16 mt-2 bg-green-100 rounded-full" src="/moneyplan.png" alt="" />
            <h1 className="mt-4 text-2xl font-semibold">회원가입</h1>
            <p className="text-gray-500 mt-2 text-sm">새 계정을 만들어 보세요</p>
          </div>

          <div className="flex flex-col items-stretch w-full mt-8 gap-2">
            <label htmlFor="name" className="text-xs">이름</label>
            <input
              id="name"
              type="text"
              placeholder=" 👤    이름을 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="flex flex-col items-stretch w-full mt-5 gap-2">
            <label htmlFor="email" className="text-xs">이메일 주소</label>
            <input
              id="email"
              type="email"
              placeholder=" ✉️    이메일을 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col items-stretch w-full mt-5 gap-2">
            <label htmlFor="password" className="text-xs">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder=" 🔒    비밀번호를 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex flex-col items-stretch w-full mt-5 gap-2">
            <label htmlFor="confirm" className="text-xs">비밀번호 확인</label>
            <input
              id="confirm"
              type="password"
              placeholder=" 🔒    비밀번호를 다시 입력하세요"
              className="border rounded w-full h-11 px-3 text-base border-gray-400 placeholder:text-xs"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          <label className="flex gap-2 items-start mt-5 w-full">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-xs text-gray-600 leading-5">
              이용약관과 개인정보 처리방침에 동의합니다.
            </span>
          </label>

          {err && (
            <div className="mt-3 text-xs text-red-600 w-full" role="alert" aria-live="polite">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white text-sm py-3 rounded w-full mt-5 disabled:opacity-60"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          <div className="flex gap-1 mt-5 text-sm justify-center">
            <span className="text-gray-500">이미 계정이 있으신가요?</span>
            <button type="button" onClick={() => navigate("/signin")} className="text-green-600">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
