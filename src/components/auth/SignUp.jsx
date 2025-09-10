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
          // 이메일 인증 사용 시, 메타데이터로 이름 저장
          data: { full_name: name },
        },
      });

      if (error) throw error;

      // 3) 성공: 안내 화면으로 전환
      setDone(true);
    } catch (e) {
      // 흔한 에러 메시지 가공
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
    // 이메일 인증 사용하는 경우: 확인 안내
    return (
      <div className="bg-green-50 w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center px-6 pb-10 border rounded-2xl shadow-2xl border-gray-50 bg-gray-50 max-w-md w-full">
          <img className="w-15 mt-10 bg-green-100 rounded-full" src="/src/assets/moneyplan.png" alt="" />
          <div className="mt-4 text-2xl font-semibold">회원가입이 완료됐어요</div>
          <button
            onClick={() => navigate("/signin", { replace: true })}
            className="bg-blue-500 text-white text-xs py-3 rounded w-full mt-6"
          >
            로그인 하러가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 w-full min-h-screen flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center px-6 pb-10 border rounded-2xl shadow-2xl border-gray-50 bg-gray-50"
      >
        <img className="w-15 mt-10 bg-green-100 rounded-full" src="/src/assets/moneyplan.png" alt="" />
        <div className="mt-4 text-2xl font-semibold">회원가입</div>
        <div className="text-gray-500 mt-2 text-sm">새 계정을 만들어 보세요</div>

        <div className="flex flex-col items-start w-80 mt-8 gap-2">
          <label className="text-xs">이름</label>
          <input
            type="text"
            placeholder=" 👤    이름을 입력하세요"
            className="border p-2 rounded w-80 border-gray-400 placeholder:text-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="flex flex-col items-start w-80 mt-5 gap-2">
          <label className="text-xs">이메일 주소</label>
          <input
            type="email"
            placeholder=" ✉️    이메일을 입력하세요"
            className="border p-2 rounded w-80 border-gray-400 placeholder:text-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col items-start w-80 mt-5 gap-2">
          <label className="text-xs">비밀번호</label>
          <input
            type="password"
            placeholder=" 🔒    비밀번호를 입력하세요"
            className="border p-2 rounded w-80 border-gray-400 placeholder:text-xs"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            minLength={6}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col items-start w-80 mt-5 gap-2">
          <label className="text-xs">비밀번호 확인</label>
          <input
            type="password"
            placeholder=" 🔒    비밀번호를 다시 입력하세요"
            className="border p-2 rounded w-80 border-gray-400 placeholder:text-xs"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex mt-5 justify-between w-full">
          <label className="flex gap-2 items-center w-full px-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span className="text-xs text-gray-500">
              이용약관과 개인정보 처리방침에 동의합니다.
            </span>
          </label>
        </div>

        {err && <div className="mt-3 text-xs text-red-600 w-80">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white text-xs py-3 rounded w-full mt-5 disabled:opacity-60"
        >
          {loading ? "처리 중..." : "회원가입"}
        </button>

        <div className="flex gap-1 mt-5 text-sm">
          <div className="text-gray-500">이미 계정이 있으신가요?</div>
          <button type="button" onClick={() => navigate("/signin")} className="text-green-600">
            로그인
          </button>
        </div>
      </form>
    </div>
  );
}
