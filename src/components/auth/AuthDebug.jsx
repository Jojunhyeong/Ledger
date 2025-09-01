import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const EMAIL = "test@example.com";
const PASSWORD = "12345678";

export default function AuthDebug() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 현재 세션 확인
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInOrSignUp = async () => {
    setLoading(true);
    setMsg("");
    try {
      // 1) 로그인 시도
      let { error } = await supabase.auth.signInWithPassword({
        email: EMAIL,
        password: PASSWORD,
      });

      // 2) 계정 없으면 가입 → 다시 로그인
      if (error?.message?.includes("Invalid login credentials")) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email: EMAIL,
          password: PASSWORD,
        });
        if (signUpErr) throw signUpErr;

        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: EMAIL,
          password: PASSWORD,
        });
        if (signInErr) throw signInErr;

        setMsg("테스트 계정을 새로 만들고 로그인했어요.");
      } else if (!error) {
        setMsg("테스트 계정으로 로그인했어요.");
      } else {
        throw error;
      }
    } catch (e) {
      console.error(e);
      setMsg(`오류: ${e.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setMsg("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMsg("로그아웃 했어요.");
    } catch (e) {
      setMsg(`오류: ${e.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-white max-w-md">
      <div className="mb-3 font-semibold">Auth Debug</div>

      <div className="text-sm text-slate-600 mb-3">
        {user ? (
          <>
            <div>현재 로그인: <b>{user.email}</b></div>
            <div className="text-xs text-slate-500">uid: {user.id}</div>
          </>
        ) : (
          <div>로그인되지 않음</div>
        )}
      </div>

      <div className="flex gap-2">
        {!user ? (
          <button
            onClick={signInOrSignUp}
            disabled={loading}
            className="h-10 px-4 rounded bg-blue-600 text-white"
          >
            {loading ? "처리 중..." : "임시 계정 로그인(없으면 생성)"}
          </button>
        ) : (
          <button
            onClick={signOut}
            disabled={loading}
            className="h-10 px-4 rounded border"
          >
            {loading ? "처리 중..." : "로그아웃"}
          </button>
        )}
      </div>

      {msg && <div className="mt-3 text-sm text-slate-700">{msg}</div>}

      {/* 참고용: 테스트 계정 정보 */}
      <div className="mt-4 text-xs text-slate-400">
        email: {EMAIL} / pw: {PASSWORD}
      </div>
    </div>
  );
}
