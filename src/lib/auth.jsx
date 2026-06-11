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

  async function logout() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    profile,
    isAdmin: profile?.role === 'admin',
    loginWithKakao,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
