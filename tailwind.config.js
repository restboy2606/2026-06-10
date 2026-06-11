/** @type {import('tailwindcss').Config} */
export default {
  // 다크/라이트 모드: <html class="dark"> 토글 방식
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // 브랜드 컬러 팔레트 (5 colors)
        //  1) navy   — 주컬러: 다크블루 (배경/타이포 기준)
        //  2) royal  — 주컬러: 로열블루 (CTA·링크·강조)
        //  3) sky    — 보조컬러: 밝은 하늘색 (그라데이션·서브 강조)
        //  4) amber  — 포인트컬러: 골드앰버 (재생버튼·뱃지·하이라이트)
        //  5) mint   — 포인트컬러2: 민트 (태그·상태·보조 포인트)
        // ============================================================
        navy: {
          50: '#eef2f9',
          100: '#d6def0',
          200: '#aebfde',
          300: '#7d96c7',
          400: '#4f6caa',
          500: '#324d86',
          600: '#243a68',
          700: '#192a4d',
          800: '#0f1c38',
          900: '#0b1a33',
          950: '#060f1f',
          DEFAULT: '#0b1a33',
        },
        royal: {
          50: '#eef3ff',
          100: '#dbe5ff',
          200: '#bccfff',
          300: '#8eabff',
          400: '#5a7dff',
          500: '#2b5bff',
          600: '#1740f0',
          700: '#1230cc',
          800: '#152aa4',
          900: '#172a82',
          DEFAULT: '#2b5bff',
        },
        sky: {
          50: '#eff9ff',
          100: '#daf0ff',
          200: '#bde6ff',
          300: '#8ed7ff',
          400: '#56bff8',
          500: '#38bdf8',
          600: '#1f9fe0',
          700: '#1980b8',
          DEFAULT: '#38bdf8',
        },
        amber: {
          50: '#fff8eb',
          100: '#ffedc6',
          200: '#ffd988',
          300: '#ffc24a',
          400: '#ffb020',
          500: '#f59417',
          600: '#d96f0d',
          DEFAULT: '#ffb020',
        },
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          DEFAULT: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        // 브랜드/라벨용 레트로 픽셀 폰트 (한글은 Pretendard로 자연 폴백)
        pixel: ['Mona', 'Pretendard', 'monospace'],
      },
      maxWidth: {
        container: '1600px',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(11, 26, 51, 0.25)',
        glow: '0 0 0 1px rgba(43, 91, 255, 0.15), 0 18px 40px -18px rgba(43, 91, 255, 0.5)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        pop: 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
