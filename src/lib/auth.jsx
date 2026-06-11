import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

// 사이트 전역 인증 상태 — 헤더/게시판 어디서든 useAuth()로 접근
const AuthContext = createContext({
  session: null,
  profile: null,
  isAdmin: false,
  loginWithKakao: () => {},
  logout: () => {},
})

// OAuth 콜백 후 주소창에 남는 찌꺼기(?code=, #access_token=) 정리
function cleanAuthUrl() {
  const url = new URL(window.location.href)
  let dirty = false
  if (url.searchParams.has('code')) {
    url.searchParams.delete('code')
    dirty = true
  }
  const tokenIdx = url.hash.indexOf('#access_token')
  if (tokenIdx !== -1) {
    url.hash = url.hash.slice(0, tokenIdx)
    dirty = true
  }
  if (dirty) window.history.replaceState(null, '', url.toString())
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') cleanAuthUrl()
    })
    cleanAuthUrl()
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setProfile(null); return }
    supabase.from('pf_profiles').select('*').eq('id', session.user.id).single()
      .then(({ data }) => setProfile(data))
  }, [session])

  async function loginWithKakao() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.href },
    })
    if (error) alert(`로그인 실패: ${error.message}`)
  }

  // 영어 에러 메시지 → 한국어 (자주 나오는 것만)
  function koMessage(msg) {
    if (/invalid login credentials/i.test(msg)) return '이메일 또는 비밀번호가 올바르지 않아요.'
    if (/already registered/i.test(msg)) return '이미 가입된 이메일이에요.'
    if (/at least 6 characters/i.test(msg)) return '비밀번호는 6자 이상이어야 해요.'
    if (/invalid format|is invalid/i.test(msg)) return '이메일 형식이 올바르지 않아요.'
    if (/rate limit/i.test(msg)) return '요청이 너무 잦아요. 잠시 후 다시 시도해주세요.'
    return msg
  }

  // 성공 시 null, 실패 시 한국어 에러 메시지 반환
  async function loginWithEmail(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? koMessage(error.message) : null
  }

  // 성공 시 null, 메일 확인 필요 시 'CONFIRM_EMAIL', 실패 시 에러 메시지
  async function signUpWithEmail(email, password, nickname) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // 트리거(pf_handle_new_user)가 name 메타데이터로 닉네임을 채움
        data: { name: nickname },
        emailRedirectTo: window.location.href,
      },
    })
    if (error) return koMessage(error.message)
    if (!data.session) return 'CONFIRM_EMAIL'
    return null
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    profile,
    isAdmin: profile?.role === 'admin',
    loginWithKakao,
    loginWithEmail,
    signUpWithEmail,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
