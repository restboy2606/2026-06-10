import { useTheme } from '../theme/ThemeContext'

// 라이트/다크 모드 전환 버튼
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드' : '다크 모드'}
      className={[
        'flex h-10 w-10 items-center justify-center rounded-full border text-lg transition',
        'border-navy-200 text-navy-700 hover:border-royal hover:text-royal',
        'dark:border-navy-600 dark:text-amber dark:hover:border-amber',
        className,
      ].join(' ')}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
