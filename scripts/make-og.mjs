// ============================================================
// OG 이미지 생성기 — public/og.png (1200×630)
// 카카오/SNS 링크 공유 시 미리보기 썸네일로 사용.
// sharp 로 SVG → PNG 렌더링. (텍스트는 폰트 호환성을 위해 영문 위주)
//   실행:  npm run og
// ============================================================
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og.png')

// 5색 팔레트 (다크블루 베이스)
const C = {
  navy: '#0b1a33',
  navy2: '#172a82',
  royal: '#2b5bff',
  sky: '#38bdf8',
  amber: '#ffb020',
  mint: '#34d399',
}

// 배경 픽셀 도트 그리드
let dots = ''
for (let y = 0; y < 630; y += 40) {
  for (let x = 0; x < 1200; x += 40) {
    if ((x / 40 + y / 40) % 3 === 0) {
      dots += `<rect x="${x}" y="${y}" width="4" height="4" fill="#ffffff" opacity="0.05"/>`
    }
  }
}

// 하단 5색 스와치 (픽셀 사각형)
const swatch = [C.navy, C.royal, C.sky, C.amber, C.mint]
  .map((c, i) => `<rect x="${80 + i * 52}" y="486" width="40" height="40" rx="4" fill="${c}" stroke="#ffffff" stroke-opacity="0.25"/>`)
  .join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy}"/>
      <stop offset="1" stop-color="${C.navy2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.2" r="0.8">
      <stop offset="0" stop-color="${C.royal}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${C.royal}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${dots}

  <!-- 픽셀 P 로고 -->
  <g transform="translate(80,70)">
    <rect width="84" height="84" rx="12" fill="${C.royal}"/>
    <rect x="58" y="58" width="14" height="14" fill="#0b1a33" opacity="0.25"/>
    <text x="42" y="58" font-family="Arial, sans-serif" font-size="56" font-weight="900" fill="#ffffff" text-anchor="middle">P</text>
  </g>
  <text x="184" y="128" font-family="Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff" letter-spacing="2">PIXELFORGE ACADEMY</text>

  <!-- 메인 타이틀 -->
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="92" font-weight="900" fill="#ffffff" letter-spacing="-1">ONLINE AI</text>
  <text x="80" y="396" font-family="Arial, sans-serif" font-size="92" font-weight="900" fill="${C.sky}" letter-spacing="-1">VIDEO SCHOOL</text>

  <!-- 서브 -->
  <text x="84" y="452" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#aebfde" letter-spacing="3">AI · AI LITERACY · WEB · PYTHON · R</text>

  <!-- 하단 스와치 + URL -->
  ${swatch}
  <text x="1120" y="514" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#aebfde" text-anchor="end">restboy2606.github.io/2026-06-09</text>

  <!-- 우측 픽셀 플레이 버튼 장식 -->
  <g transform="translate(940,170)" opacity="0.9">
    <rect width="180" height="180" rx="20" fill="#ffffff" opacity="0.08"/>
    <polygon points="70,55 70,125 130,90" fill="${C.amber}"/>
  </g>
</svg>`

await mkdir(dirname(OUT), { recursive: true })
await sharp(Buffer.from(svg)).png().toFile(OUT)
console.log('✅ OG 이미지 생성:', OUT)
