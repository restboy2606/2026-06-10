// ============================================================
// 사이트 전역 데이터 — PIXELFORGE PRESS (2D 픽셀 게임 전문 웹진)
// 콘텐츠를 바꾸려면 대부분 이 파일만 수정하면 됩니다.
//
// ▶ 신작 데스크 데이터: scripts/fetch-news.mjs 가 itch.io RSS에서
//   자동 수집 → src/data/news.json (빌드/매일 cron마다 갱신)
// ▶ 에디토리얼 기사: src/data/articles.js
// ============================================================

export const company = {
  // 웹진 브랜드 — 픽셀게임사 PIXELFORGE STUDIOS의 미디어 사업부
  name: 'PIXELFORGE PRESS',
  nameKo: '픽셀포지 프레스',
  fullName: 'PIXELFORGE PRESS · 2D PIXEL GAMES WEBZINE',
  tagline: '픽셀 게임 개발사가 만드는 2D 픽셀 게임 전문 웹진',
  intro: [
    '픽셀포지 프레스(PIXELFORGE PRESS)는 레트로 픽셀 게임 개발사 PIXELFORGE STUDIOS의 미디어 사업부입니다.',
    '전 세계 2D 픽셀 게임 신작을 매일 수집해 전하고, 개발 현장의 데브로그와 칼럼을 직접 씁니다. 픽셀 그래픽 게임만 다루는, 도트 덕후들을 위한 단 하나의 데스크.',
  ],

  // 연락처 (유일한 실제 연락처 — 절대 바꾸지 말 것)
  email: 'ssujklim@gmail.com',
  tel: '이메일 제보 환영',
  kakao: '@pixelforge',
  hours: '신작 데스크 매일 자동 갱신',

  // 운영사 정보 — 푸터 표기 (교육 실습용 프로토타입)
  operator: {
    nameKo: '픽셀포지 스튜디오',
    nameEn: 'PIXELFORGE STUDIOS',
    ceo: '임종권 (restboy2606)',
    ceoTitle: 'Est. 2025.12.25 · 레트로 픽셀 게임 개발사',
    note: '본 사이트는 수도권ICT이노베이션스퀘어 「쉬었음 청년 디지털 맞춤 교육」 실습용 프로토타입입니다.',
    site: 'https://restboy2606.github.io/2026-06-08/',
  },

  copyright: '© 2026 PIXELFORGE STUDIOS · 교육 실습 프로토타입 (restboy2606)',

  social: [
    { label: 'GitHub', url: 'https://github.com/restboy2606' },
  ],

  // 패밀리 사이트 — 우리 프로젝트들로 연결
  familySites: [
    { name: 'PIXELFORGE STUDIOS (게임사 홈)', url: 'https://restboy2606.github.io/2026-06-08/' },
    { name: 'FORGE POP — 픽셀 클리커 게임', url: 'https://restboy2606.github.io/2026-06-08/play.html' },
    { name: '청년정책 안내 챗봇', url: 'https://youth-policy-chatbot.vercel.app' },
  ],

  footerLinks: [
    { label: '이용약관', to: '/terms' },
    { label: '개인정보처리방침', to: '/privacy', strong: true },
  ],
}

// 웹진 섹션 (헤더 내비 + 푸터 링크 공용)
export const sections = [
  { label: '신작 데스크', to: '/news', desc: 'itch.io 픽셀 신작을 매일 자동 수집' },
  { label: '에디토리얼', to: '/articles', desc: '데브로그·비하인드·칼럼 — 직접 쓰는 기사' },
  { label: '자유게시판', to: '/community', desc: '독자 커뮤니티 — 제보·토론·Q&A' },
]

// 웹진 강점 (홈 소개 섹션)
export const features = [
  {
    icon: '🗞️',
    title: '매일 갱신되는 신작 데스크',
    desc: 'itch.io의 픽셀아트 신작·인기작을 매일 아침 자동 수집해 전합니다. 사람이 안 자도 데스크는 돌아갑니다.',
  },
  {
    icon: '⚒️',
    title: '개발사가 직접 쓰는 기사',
    desc: '게임을 만들어본 사람이 씁니다. 데브로그·제작 비하인드·기술 삽질기까지 현장의 기록.',
  },
  {
    icon: '🎯',
    title: '오직 2D 픽셀만',
    desc: '3D도 AAA도 다루지 않습니다. 도트 그래픽 게임만 파는 전문 데스크.',
  },
  {
    icon: '⚔️',
    title: '독자 커뮤니티',
    desc: '회원이 되면 기사에 반응·댓글을 남기고, 자유게시판에서 제보하고 토론할 수 있습니다.',
  },
]
