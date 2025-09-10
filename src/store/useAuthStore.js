// src/store/useAuthStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useBudgetStore } from "./useBudgetStore";
import { useCategoryStore } from "./useCategoryStore";
import { useLedgerStore } from "./useLedgerStore";

async function ensureProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 로그인된 uid로 profiles 한 줄은 반드시 존재하도록 보장
  const username =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "user";

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, name: username },   // 필요한 컬럼만
      { onConflict: "id" }
    );
  if (error) {
    // 프로필 RLS가 있으면 WITH CHECK (id = auth.uid()) 인지 확인
    console.error("[ensureProfile] upsert error", error);
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  _started: false,
  _unsub: null,

  // ---- 부트스트랩: 앱 시작 시 1회만 호출 ----
  async init() {
    const { _started } = get();
    if (_started) return;
    set({ _started: true });

    // 1) 초기 세션 반영
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
    });

    // ★ 초기에도 프로필 보장 (새 탭/새로고침 대비)
    if (data.session?.user) {
      await ensureProfile(); // ✅ 여기 추가
    }

    // 2) 인증 이벤트 전역 구독
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, user: session?.user ?? null });

      if (event === "SIGNED_IN") {
        // ★ 로그인 직후 프로필 보장
        await ensureProfile(); // ✅ 여기 추가

        // 로그인 시 전역 리프레시
        await Promise.allSettled([
          useBudgetStore.getState().refresh?.(),
          useCategoryStore.getState().refresh?.(),
          useLedgerStore.getState()?.refresh?.(),
        ]);
      } else if (event === "SIGNED_OUT") {
        // 로그아웃 시 전역 초기화
        useBudgetStore.setState({ items: [] });
        useCategoryStore.setState({ items: [] });
        useLedgerStore.setState?.({ items: [] });
      }
    });

    set({ _unsub: () => sub.subscription.unsubscribe() });
  },

  cleanup() {
    const { _unsub } = get();
    if (_unsub) _unsub();
    set({ _started: false, _unsub: null });
  },

  // ---- 액션들 ----
  async signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;

    // 이메일 인증 OFF 환경이라면 여기서도 보장 가능
    if (data.session?.user) {
      await ensureProfile(); // (안전)
    }
    return { needsConfirm: !data.session };
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // ensureProfile은 SIGNED_IN 이벤트에서 호출됨
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
}));
