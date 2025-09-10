// src/store/useAuthStore.js
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useBudgetStore } from "./useBudgetStore";
import { useCategoryStore } from "./useCategoryStore";
import { useLedgerStore } from "./useLedgerStore";

/** 신규 유저 기본 카테고리 시딩 (count 기반 확인) */
async function seedDefaultCategories(userId) {
  // 현재 유저 카테고리 개수만 빠르게 확인 (head 모드 → count만 옴)
  const { count, error: countErr } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countErr) {
    console.warn("[seedDefaultCategories] count error:", countErr);
    return;
  }

  if ((count ?? 0) === 0) {
    const defaults = [
      { user_id: userId, name: "급여",   icon_key: "wallet",   kind: "income"  },
      { user_id: userId, name: "식비",   icon_key: "utensils", kind: "expense" },
      { user_id: userId, name: "교통비", icon_key: "tram",     kind: "expense" },
      { user_id: userId, name: "생활비", icon_key: "cart",     kind: "expense" },
    ];

    const { error: insErr } = await supabase.from("categories").insert(defaults);
    if (insErr) {
      console.warn("[seedDefaultCategories] insert error:", insErr);
    } else {
      // 카테고리 스토어 즉시 동기화(있으면)
      try {
        await useCategoryStore.getState().refresh?.();
      } catch (_) {}
    }
  }
}

/** 프로필 보장 + (없을 때) 기본 카테고리 시딩 */
async function ensureProfile() {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) {
    console.error("[ensureProfile] getUser error:", userErr);
    return;
  }
  if (!user) return;

  // 1) profiles 보장
  const username =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "user";

  const { error: profErr } = await supabase
    .from("profiles")
    .upsert({ id: user.id, name: username }, { onConflict: "id" });
  if (profErr) {
    console.error("[ensureProfile] profiles upsert error:", profErr);
    return; // 프로필 실패 시 시딩은 생략
  }

  // 2) 기본 카테고리 시딩
  await seedDefaultCategories(user.id);
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
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("[auth.init] getSession error:", error);
    }
    set({
      session: data?.session ?? null,
      user: data?.session?.user ?? null,
      loading: false,
    });

    // 초기 진입 시에도 프로필/기본 카테고리 보장
    if (data?.session?.user) {
      await ensureProfile();
    }

    // 2) 인증 이벤트 전역 구독
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        set({ session, user: session?.user ?? null });

        if (event === "SIGNED_IN") {
          // 로그인 직후 보장 & 시딩
          await ensureProfile();

          // 전역 데이터 병렬 리프레시
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
      }
    );

    set({ _unsub: () => sub.subscription.unsubscribe() });
  },

  // (선택) 정리
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
      options: { data: { full_name: name } },
    });
    if (error) throw error;

    // 이메일 인증 OFF 환경이면 즉시 세션 존재 → 안전하게 보장
    if (data.session?.user) {
      await ensureProfile();
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
