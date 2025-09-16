// src/store/useAuthStore.js
import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import { useBudgetStore } from './useBudgetStore'
import { useCategoryStore } from './useCategoryStore'
import { useTransactionStore } from './useTransactionStore'

async function ensureProfile() {
  // 현재 세션 기준 유저
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr) {
    console.error('[ensureProfile] getUser error:', userErr)
    return
  }
  if (!user) return

  // name은 메타데이터 → 없으면 이메일 ID
  const username = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'user'

  // ⚠️ upsert는 RLS/제약과 스키마가 맞아야 함(아래 2번 SQL 참고)
  const { error: profErr } = await supabase
    .from('profiles')
    .upsert({ id: user.id, name: username }, { onConflict: 'id' }) // id PK면 OK
  if (profErr) console.error('[ensureProfile] profiles upsert error:', profErr)
}

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  _started: false,
  _ensuredOnce: false,
  _unsubscribe: null,

  async init() {
    if (get()._started) return
    set({ _started: true })

    // 1) 초기 세션
    const { data, error } = await supabase.auth.getSession()
    if (error) console.error('[auth.init] getSession error:', error)
    set({ session: data?.session ?? null, user: data?.session?.user ?? null, loading: false })

    // 2) 프로필 보장(최초 1회)
    if (data?.session?.user && !get()._ensuredOnce) {
      await ensureProfile()
      set({ _ensuredOnce: true })
    }

    // 3) 인증 이벤트 구독 (v2 반환값 구조 주의)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, user: session?.user ?? null })

      if (event === 'SIGNED_IN') {
        if (!get()._ensuredOnce) {
          await ensureProfile()
          set({ _ensuredOnce: true })
        }
        // 선택: 각 스토어에 refresh가 있을 때만 호출
        try {
          await Promise.allSettled([
            useBudgetStore.getState().refresh?.(),
            useCategoryStore.getState().refresh?.(),
            useTransactionStore.getState().refresh?.(),
          ])
        } catch (e) {
          console.warn('[auth] refresh skipped:', e)
        }
      }

      if (event === 'SIGNED_OUT') {
        // 클라이언트 스토어 초기화
        useBudgetStore.setState?.({ items: [] })
        useCategoryStore.setState?.({ items: [] })
        useTransactionStore.setState?.({ items: [] })
        set({ _ensuredOnce: false })
      }
    })

    set({ _unsubscribe: () => subscription.unsubscribe() })
  },

  cleanup() {
    get()._unsubscribe?.()
    set({ _started: false, _unsubscribe: null })
  },

  async signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) throw error

    // 이메일 확인을 쓰면 session이 없을 수 있음
    if (data.session?.user && !get()._ensuredOnce) {
      await ensureProfile()
      set({ _ensuredOnce: true })
    }
    return { needsConfirm: !data.session }
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    window.location.reload()
  },
}))
