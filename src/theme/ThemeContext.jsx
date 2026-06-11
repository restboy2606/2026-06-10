import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// ============================================================
// 다크/라이트 모드 전역 상태
//  - localStorage('theme') 에 사용자 선택 저장
//  - 초기값은 index.html 의 인라인 스크립트가 이미 <html>.dark 를 적용
//  - 저장값 없으면 OS 설정(prefers-color-scheme) 추종
// ============================================================
const ThemeContext = createContext({ theme: 'light', toggle: () => {} })

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      /* ignore */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
