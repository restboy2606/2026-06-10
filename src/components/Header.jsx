import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { company, sections } from '../data/site'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../lib/auth'
import { isConfigured } from '../lib/supabase'

// 상단 네비게이션 — 웹진 섹션 (site.js sections 기반)
const nav = [
  { label: '홈', to: '/' },
  ...sections.map((s) => ({ label: s.label, to: s.to })),
  { label: '회사소개', to: '/about' },
  { label: '문의', to: '/contact' },
]

// 로그인 드롭다운 — 카카오 + 이메일 로그인/회원가입
function LoginPanel({ onClose }) {
  const { loginWithKakao, loginWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [nickname, setNickname] = useState('')
  const [msg, setMsg] = useState(null) // { type: 'error'|'info', text }
  const [busy, setBusy] = useState(false)

  const isSignup = mode === 'signup'

  async function submit() {
    if (busy) return
    setMsg(null)
    if (!email.trim() || !pw) { setMsg({ type: 'error', text: '이메일과 비밀번호를 입력해주세요.' }); return }
    if (isSignup && !nickname.trim()) { setMsg({ type: 'error', text: '닉네임을 입력해주세요.' }); return }
    setBusy(true)
    const result = isSignup
      ? await signUpWithEmail(email.trim(), pw, nickname.trim())
      : await loginWithEmail(email.trim(), pw)
    setBusy(false)
    if (!result) { onClose(); return }
    if (result === 'CONFIRM_EMAIL') {
      setMsg({ type: 'info', text: '확인 메일을 보냈어요! 메일함에서 링크를 눌러 가입을 완료해주세요.' })
      return
    }
    setMsg({ type: 'error', text: result })
  }

  const fieldCls =
    'w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-royal dark:border-navy-600 dark:bg-navy-900 dark:text-white'

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-navy-100 bg-white p-4 shadow-xl dark:border-navy-700 dark:bg-navy-800">
      <button
        type="button"
        onClick={() => { onClose(); loginWithKakao() }}
        className="w-full rounded-lg bg-[#FEE500] px-4 py-2.5 text-sm font-extrabold text-[#191919] transition hover:opacity-85"
      >
        카카오로 시작하기
      </button>

      <div className="my-3 flex items-center gap-2 text-[11px] text-navy-400 dark:text-navy-500">
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-700" />
        또는 이메일로
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-700" />
      </div>

      <div className="flex flex-col gap-2">
        {isSignup && (
          <input
            className={fieldCls}
            placeholder="닉네임"
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}
        <input
          className={fieldCls}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={fieldCls}
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {msg && (
          <p
            className={[
              'rounded-lg px-3 py-2 text-xs leading-5',
              msg.type === 'error'
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                : 'bg-sky/10 text-royal dark:text-sky',
            ].join(' ')}
          >
            {msg.text}
          </p>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="w-full rounded-lg bg-royal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-royal/90 disabled:opacity-40"
        >
          {busy ? '처리 중…' : isSignup ? '회원가입' : '이메일로 로그인'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => { setMode(isSignup ? 'login' : 'signup'); setMsg(null) }}
        className="mt-3 w-full text-center text-xs text-navy-500 underline-offset-2 hover:underline dark:text-navy-300"
      >
        {isSignup ? '이미 계정이 있어요 → 로그인' : '아직 계정이 없어요 → 회원가입'}
      </button>
    </div>
  )
}

// 우측 상단 로그인 영역 — 비로그인: 로그인 버튼(드롭다운), 로그인: 프사+닉네임+로그아웃
function AuthBox() {
  const { session, profile, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)

  if (!isConfigured) return null

  if (!session) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-royal px-4 py-2 text-sm font-bold text-white transition hover:bg-royal/90"
        >
          로그인
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <LoginPanel onClose={() => setOpen(false)} />
          </>
        )}
      </div>
    )
  }

  const avatar = session.user?.user_metadata?.avatar_url?.replace(/^http:/, 'https:')
  return (
    <div className="flex items-center gap-2">
      {avatar && (
        <img src={avatar} alt="" className="h-8 w-8 rounded-full border border-navy-100 dark:border-navy-700" />
      )}
      <span className="hidden items-center gap-1.5 text-sm font-bold text-navy-800 dark:text-navy-100 sm:flex">
        {profile?.nickname || '...'}
        {isAdmin && (
          <em className="font-pixel rounded border border-royal px-1 py-0.5 text-[9px] not-italic text-royal dark:border-sky dark:text-sky">
            ADMIN
          </em>
        )}
      </span>
      <button type="button" onClick={logout} className="btn-ghost text-sm">
        로그아웃
      </button>
    </div>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="font-pixel flex h-9 w-9 items-center justify-center rounded-md bg-royal text-lg text-white pixel-shadow">
        P
      </span>
      <span className="font-pixel text-base font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-xl">
        {company.name}
      </span>
    </Link>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/90 backdrop-blur dark:border-navy-700 dark:bg-navy-900/90">
      <nav onMouseLeave={() => setHovered(null)}>
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <Logo />

          {/* 데스크탑 메뉴 */}
          <ul className="hidden items-stretch lg:flex">
            {nav.map((item) => (
              <li
                key={item.label}
                className="flex items-center"
                onMouseEnter={() => setHovered(item.label)}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'px-5 py-7 text-base font-bold transition-colors',
                      isActive
                        ? 'text-royal dark:text-sky'
                        : 'text-navy-700 hover:text-royal dark:text-navy-100 dark:hover:text-sky',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 우측: 로그인 + 테마토글 + 햄버거 */}
          <div className="flex items-center gap-2">
            <AuthBox />
            <ThemeToggle />
            <button
              type="button"
              aria-label="메뉴 열기"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <span className="h-0.5 w-6 bg-navy-800 dark:bg-white" />
              <span className="h-0.5 w-6 bg-navy-800 dark:bg-white" />
              <span className="h-0.5 w-6 bg-navy-800 dark:bg-white" />
            </button>
          </div>
        </div>

      </nav>

      {/* 모바일 패널 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm overflow-y-auto bg-white p-6 shadow-xl dark:bg-navy-900">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="메뉴 닫기"
                className="text-2xl text-navy-400"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.label} className="border-b border-navy-100 py-1 dark:border-navy-700">
                  <Link
                    to={item.to}
                    end={item.to === '/' ? 'true' : undefined}
                    className="block py-2 text-lg font-bold text-navy-900 dark:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="flex flex-col pb-2">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            className="block py-1.5 pl-3 text-sm text-navy-500 dark:text-navy-300"
                            onClick={() => setMobileOpen(false)}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
