import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { company, topics } from '../data/site'
import ThemeToggle from './ThemeToggle'

// 상단 네비게이션 구성 (영상 강의는 주제별 하위메뉴)
const nav = [
  { label: '홈', to: '/' },
  {
    label: '영상 강의',
    to: `/videos/${topics[0].key}`,
    children: topics.map((t) => ({ label: t.label, to: `/videos/${t.key}` })),
  },
  { label: '회사소개', to: '/about' },
  { label: '길드 게시판', to: '/community' },
  { label: '문의', to: '/contact' },
]

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

          {/* 우측: 테마토글 + 햄버거 */}
          <div className="flex items-center gap-2">
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

        {/* 데스크탑 드롭다운 (영상 강의 주제) */}
        <div
          className={[
            'hidden overflow-hidden border-t border-navy-100 bg-white transition-all duration-200 dark:border-navy-700 dark:bg-navy-900 lg:block',
            hovered === '영상 강의' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          onMouseEnter={() => setHovered('영상 강의')}
        >
          <div className="container-x flex flex-wrap gap-2 py-5">
            {topics.map((t) => (
              <Link
                key={t.key}
                to={`/videos/${t.key}`}
                className="rounded-full bg-navy-50 px-4 py-2 text-sm font-bold text-navy-700 transition hover:bg-royal hover:text-white dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-royal"
              >
                {t.label}
              </Link>
            ))}
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
