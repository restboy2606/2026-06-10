// ============================================================
// 사이트 전역 데이터 — 회사 정보 / 영상 주제(메뉴) / 모듈 / 동영상
// 콘텐츠를 바꾸려면 대부분 이 파일만 수정하면 됩니다.
//
// ▶ 유튜브 영상 추가/교체
//   - youtubeId : 유튜브 URL(https://youtu.be/XXXX)의 XXXX 부분 (11자리)
//   - module    : 소분류(아래 topics[].modules 중 하나와 일치해야 필터됨)
//   - 영상 공개범위는 "미등록(링크 공개)" 권장 (비공개는 임베드 재생 불가)
// ============================================================

export const company = {
  // 교육 브랜드 (사이트명) — 픽셀게임사 PIXELFORGE STUDIOS의 교육 사업부
  name: 'PIXELFORGE ACADEMY',
  nameKo: '픽셀포지 아카데미',
  fullName: 'PIXELFORGE ACADEMY · ONLINE AI LEARNING',
  tagline: '픽셀 게임 개발사가 만든 AI·AI 리터러시 영상 학교',
  intro: [
    '픽셀포지 아카데미(PIXELFORGE ACADEMY)는 레트로 픽셀 게임 개발사 PIXELFORGE STUDIOS의 교육 사업부입니다.',
    '게임 한 판 깨듯 재미있게 — AI 콘텐츠 제작부터 AI 리터러시, 웹·파이썬·R 기초까지, 누구나 단계별로 클리어하며 배우도록 동영상 강의로 제공합니다.',
  ],

  // 연락처 (유일한 실제 연락처 — 절대 바꾸지 말 것)
  email: 'ssujklim@gmail.com',
  tel: '이메일 문의 환영',
  kakao: '@pixelforge',
  hours: '온라인 24/7 시청',

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
    { label: 'YouTube', url: 'https://youtube.com' },
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

// 핵심 강점 (홈 Features 섹션)
export const features = [
  {
    icon: '🎮',
    title: '게임처럼 한 판씩',
    desc: '주제 → 모듈 → 한 편씩 클리어하는 퀘스트형 커리큘럼. 부담 없이 레벨업합니다.',
  },
  {
    icon: '🕹️',
    title: 'AI & AI 리터러시 중심',
    desc: '생성형 AI 콘텐츠 제작부터 AI 시대의 사고력·생산성 도구까지 핵심만 담았습니다.',
  },
  {
    icon: '📱',
    title: '모바일 최적화',
    desc: 'PC·태블릿·스마트폰 어디서든 끊김 없이 시청 가능한 반응형 픽셀 UI.',
  },
  {
    icon: '🌗',
    title: '라이트 & 다크 모드',
    desc: '밝은 데이라이트 테마와 레트로 다크 테마를 한 번에 전환하세요.',
  },
]

// ============================================================
// 영상 주제(메뉴) — 대탭 + 소분류(모듈)
//  modules 의 각 문자열은 videos[].module 과 일치해야 필터됩니다.
// ============================================================
export const topics = [
  {
    key: 'creation',
    label: 'AI 콘텐츠 제작',
    title: '생성형 AI 콘텐츠 제작 실무',
    headline: 'AI로 만드는 콘텐츠 — 기획부터 코딩까지',
    desc: '글·이미지·영상·프레젠테이션 제작은 물론, 피그마와 바이브코딩까지. 생성형 AI를 실무에 바로 적용하는 제작 노하우를 익힙니다.',
    accent: 'royal',
    modules: ['콘텐츠 제작', '이미지 만들기', '영상 제작', '프레젠테이션', '효과적 발표', '피그마', '바이브코딩'],
  },
  {
    key: 'literacy',
    label: 'AI 리터러시',
    title: 'AI 리터러시 & 학습 역량',
    headline: 'AI 시대의 사고력과 생산성 도구',
    desc: '창의적 문제해결과 디자인씽킹·컴퓨팅 사고력부터, 마크다운·노션·리포트 작성·인용 관리까지 — AI 시대의 학습 역량을 기릅니다.',
    accent: 'sky',
    modules: ['창의·문제해결', '디자인씽킹', '컴퓨팅 사고', '마크다운', '노션', '리포트 작성', '인용·출처'],
  },
  {
    key: 'web',
    label: '웹 개발 기초',
    title: 'HTML 기초 수업',
    headline: '웹 개발, HTML부터 jQuery까지',
    desc: 'HTML·CSS3 기초부터 자바스크립트·jQuery까지, 웹 페이지 제작의 핵심을 단계별로 익히는 기초 수업입니다.',
    accent: 'mint',
    modules: ['HTML/CSS', 'JavaScript', 'jQuery'],
  },
  {
    key: 'python',
    label: '파이썬 프로그래밍',
    title: '파이썬 프로그래밍 (소프트웨어 기초)',
    headline: '코딩 첫걸음, 파이썬으로 시작하기',
    desc: '파이썬 설치와 환경설정부터 변수·계산·자료형·반복문·함수까지, 비전공자도 따라할 수 있는 소프트웨어 기초 강의입니다.',
    accent: 'amber',
    modules: ['소개·설치', '변수·터틀', '변수·입출력', '자료형', '반복문·함수'],
  },
  {
    key: 'r',
    label: 'R 프로그래밍',
    title: 'R 프로그래밍 (데이터 분석)',
    headline: '데이터로 말하는 법, R로 배우기',
    desc: 'R 기초 문법부터 그래프 시각화, 한국복지패널 데이터를 활용한 실전 분석까지 단계별로 익힙니다.',
    accent: 'royal',
    modules: ['기초', '그래프', '데이터 분석'],
  },
]

// ============================================================
// 동영상 데이터 (topic 키별 배열)
// ============================================================
export const videos = {
  creation: [
    { id: 'c1', youtubeId: 'Wxfb4DaqqYw', module: '콘텐츠 제작', title: 'AI 콘텐츠 제작 ①', desc: '생성형 AI로 콘텐츠를 기획하고 초안을 완성하는 기본기.' },
    { id: 'c2', youtubeId: 'A8b_9wGLdt4', module: '콘텐츠 제작', title: 'AI 콘텐츠 제작 ②', desc: '실전 사례로 배우는 콘텐츠 제작 워크플로우.' },
    { id: 'c3', youtubeId: 'ME6FYY_Lj9o', module: '이미지 만들기', title: '수려한 이미지 만들기 ①', desc: '이미지 생성 AI로 고품질 비주얼을 만드는 법.' },
    { id: 'c4', youtubeId: 'BKLSj1zGOjY', module: '이미지 만들기', title: '수려한 이미지 만들기 ②', desc: '프롬프트와 보정으로 완성도를 높이는 심화편.' },
    { id: 'c5', youtubeId: '6JQ7F-19598', module: '영상 제작', title: 'AI 영상 제작 ①', desc: 'AI 도구로 영상 콘텐츠를 빠르게 제작하기.' },
    { id: 'c6', youtubeId: '7qJ4g_6ZrpA', module: '영상 제작', title: 'AI 영상 제작 ②', desc: '편집·자막·효과까지 AI로 효율화하기.' },
    { id: 'c7', youtubeId: 'pGMPdPW9kMM', module: '영상 제작', title: 'AI 영상 제작 ③', desc: '완성도 높은 영상으로 마무리하는 실전편.' },
    { id: 'c8', youtubeId: 'CMhU0GerdIA', module: '프레젠테이션', title: 'AI 프레젠테이션 제작 ①', desc: 'AI로 설득력 있는 발표 자료를 설계하기.' },
    { id: 'c9', youtubeId: 'A7Z2H4BJMIQ', module: '프레젠테이션', title: 'AI 프레젠테이션 제작 ②', desc: '디자인과 구성을 AI로 빠르게 완성하기.' },
    { id: 'c10', youtubeId: 'uL_IiYDtcbs', module: '프레젠테이션', title: 'AI 프레젠테이션 제작 ③', desc: '실전 템플릿으로 발표 자료 완성하기.' },
    { id: 'c11', youtubeId: 't8qhHm42ie4', module: '효과적 발표', title: '효과적인 프레젠테이션', desc: '청중을 사로잡는 발표 전달 전략.' },
    { id: 'c12', youtubeId: 'Wi0EWqLpSwg', module: '피그마', title: '피그마 활용 ①', desc: 'AI 시대의 디자인 협업 도구 피그마 입문.' },
    { id: 'c13', youtubeId: 'tSOs9b-M6TM', module: '피그마', title: '피그마 활용 ②', desc: '실전 화면 설계와 프로토타이핑.' },
    { id: 'c14', youtubeId: 'LnqUCQGDzaQ', module: '바이브코딩', title: '바이브코딩 ①', desc: 'AI와 함께 코드를 작성하는 바이브코딩 입문.' },
    { id: 'c15', youtubeId: 'dbOIYu3YQcI', module: '바이브코딩', title: '바이브코딩 ②', desc: '실전 프로젝트로 익히는 AI 페어 코딩.' },
    { id: 'c16', youtubeId: 'Xabe8aFvOqA', module: '바이브코딩', title: '바이브코딩 ③', desc: '기능 구현과 디버깅을 AI로 가속하기.' },
    { id: 'c17', youtubeId: 'vzcvfwk6lI8', module: '바이브코딩', title: '바이브코딩 ④', desc: '배포까지 이어지는 바이브코딩 완성편.' },
  ],
  literacy: [
    { id: 'l1', youtubeId: 'JJjFNBV66As', module: '창의·문제해결', title: '창의력·복합문제해결에서의 AI ①', desc: '복잡한 문제를 AI와 함께 창의적으로 해결하기.' },
    { id: 'l2', youtubeId: 'cd-OKHeomEs', module: '창의·문제해결', title: '창의력·복합문제해결에서의 AI ②', desc: '문제 정의와 발상 단계에서의 AI 활용.' },
    { id: 'l3', youtubeId: 'Lk1VTV2hNag', module: '창의·문제해결', title: '창의력·복합문제해결에서의 AI ③', desc: '실전 케이스로 보는 창의적 문제해결.' },
    { id: 'l4', youtubeId: 'rcOz0mtCrs4', module: '디자인씽킹', title: '디자인씽킹과 생성형 AI', desc: '사용자 중심 사고에 생성형 AI를 결합하기.' },
    { id: 'l5', youtubeId: 'nXj0Gu5eVXY', module: '컴퓨팅 사고', title: '컴퓨터 사고력', desc: '문제를 분해하고 절차화하는 컴퓨팅 사고력.' },
    { id: 'l6', youtubeId: 'JZ-C64wfYz0', module: '마크다운', title: 'Markdown 활용 ①', desc: '문서 작성의 기본, 마크다운 문법 익히기.' },
    { id: 'l7', youtubeId: 'pP3vjiUyhf0', module: '마크다운', title: 'Markdown 활용 ②', desc: '실전 문서·노트에 마크다운 적용하기.' },
    { id: 'l8', youtubeId: '6bKsR2Abx7w', module: '노션', title: 'Notion 마스터클래스 ①', desc: '노션으로 지식과 업무를 체계화하기.' },
    { id: 'l9', youtubeId: 'mOOJRixC3WU', module: '노션', title: 'Notion 마스터클래스 ②', desc: '데이터베이스·템플릿 활용 심화편.' },
    { id: 'l10', youtubeId: '4W4QNCIooXU', module: '리포트 작성', title: 'AI 리포트 작성법 ①', desc: 'AI를 활용한 리포트 기획과 구조 설계.' },
    { id: 'l11', youtubeId: 'NbVacutsdlM', module: '리포트 작성', title: 'AI 리포트 작성법 ②', desc: '근거를 갖춘 설득력 있는 글쓰기.' },
    { id: 'l12', youtubeId: 'hRHCFLY8ph4', module: '리포트 작성', title: 'AI 리포트 작성법 ③', desc: '검토·교정으로 완성도를 높이는 마무리.' },
    { id: 'l13', youtubeId: 'XsEKcOPIddo', module: '인용·출처', title: '대학생을 위한 인용·출처 관리', desc: '올바른 인용과 출처 관리로 신뢰도 높이기.' },
  ],
  // HTML 기초 수업 (web01~web20)
  // web01~web20 전체 연결 완료.
  web: [
    { id: 'w1', youtubeId: 'uUUfMX_W12I', module: 'HTML/CSS', title: 'web01', desc: 'HTML 기초 수업 01강.' },
    { id: 'w2', youtubeId: 'jstqtVNxQI8', module: 'HTML/CSS', title: 'web02', desc: 'HTML 기초 수업 02강.' },
    { id: 'w3', youtubeId: 'aXeSL4Tkj1U', module: 'HTML/CSS', title: 'web03', desc: 'HTML 기초 수업 03강.' },
    { id: 'w4', youtubeId: 'JNPO9dAQZVw', module: 'HTML/CSS', title: 'web04', desc: 'HTML 기초 수업 04강.' },
    { id: 'w5', youtubeId: 'aCsZM-GC3nM', module: 'HTML/CSS', title: 'web05', desc: 'HTML 기초 수업 05강.' },
    { id: 'w6', youtubeId: 'O-HuAdPHixY', module: 'HTML/CSS', title: 'web06', desc: 'HTML 기초 수업 06강.' },
    { id: 'w7', youtubeId: 'WK3nXHXUJJQ', module: 'HTML/CSS', title: 'web07 예제활용 1', desc: 'HTML/CSS 예제 활용 ①.' },
    { id: 'w8', youtubeId: '2CV_bMdniXc', module: 'HTML/CSS', title: 'web08 예제활용 2', desc: 'HTML/CSS 예제 활용 ②.' },
    { id: 'w9', youtubeId: 'Rmt8BDMe130', module: 'HTML/CSS', title: 'web09', desc: 'HTML 기초 수업 09강.' },
    { id: 'w10', youtubeId: 'HaAIEPnAr2U', module: 'HTML/CSS', title: 'web10', desc: 'HTML 기초 수업 10강.' },
    { id: 'w11', youtubeId: 'smJAzeeUz8I', module: 'HTML/CSS', title: 'web11', desc: 'HTML 기초 수업 11강.' },
    { id: 'w12', youtubeId: '5ew_B5UitwI', module: 'HTML/CSS', title: 'web12 · 6장 CSS3 속성', desc: 'CSS3 주요 속성 다루기.' },
    { id: 'w13', youtubeId: 'hVh0dXjSrFY', module: 'HTML/CSS', title: 'web13', desc: 'HTML 기초 수업 13강.' },
    { id: 'w14', youtubeId: 'l8_51aOCLac', module: 'HTML/CSS', title: 'web14', desc: 'HTML 기초 수업 14강.' },
    { id: 'w15', youtubeId: 'NcjMq3yJvzM', module: 'HTML/CSS', title: 'web15', desc: 'HTML 기초 수업 15강.' },
    { id: 'w16', youtubeId: 'yqPMJfYgoAE', module: 'HTML/CSS', title: 'web16', desc: 'HTML 기초 수업 16강.' },
    { id: 'w17', youtubeId: '3kT5piWpLLQ', module: 'JavaScript', title: 'web17 · js01', desc: '자바스크립트 기초 ①.' },
    { id: 'w18', youtubeId: 'XhLOSH93N8M', module: 'JavaScript', title: 'web18 · js02', desc: '자바스크립트 기초 ②.' },
    { id: 'w19', youtubeId: 'phmoxP-3mAE', module: 'jQuery', title: 'web19 · jq01', desc: 'jQuery 기초 ①.' },
    { id: 'w20', youtubeId: 'KG70ILYY7tQ', module: 'jQuery', title: 'web20 · jq02', desc: 'jQuery 기초 ②.' },
  ],
  // 파이썬 프로그래밍 (소프트웨어 기초) — 전체 연결 완료
  python: [
    { id: 'p1', youtubeId: 'BVCscBV_dBM', module: '소개·설치', title: 'CAU Python 01 — 오리엔테이션', desc: '강의 소개와 파이썬 개요.' },
    { id: 'p2', youtubeId: 'OLsPr6s17Mw', module: '소개·설치', title: '파이썬 프로그래밍 ①-1', desc: '프로그래밍 언어와 파이썬 소개.' },
    { id: 'p3', youtubeId: 'e0UAJSun7iM', module: '소개·설치', title: '파이썬 프로그래밍 ①-2', desc: 'Print 명령과 간단한 계산식.' },
    { id: 'p4', youtubeId: 'c41ut8-rlgs', module: '소개·설치', title: 'Mac OS에 파이썬 설치하기', desc: '[경기대] 파이썬 설치와 환경 설정.' },
    { id: 'p5', youtubeId: 'EFjvLZOcuoA', module: '변수·터틀', title: '3주차 ① — 변수와 입출력', desc: '변수 개념과 입력·출력 방법.' },
    { id: 'p6', youtubeId: 'Ta0RzSN1X2w', module: '변수·터틀', title: '3주차 ② — 터틀 그래픽', desc: '터틀 그래픽으로 다각형 그리기.' },
    { id: 'p7', youtubeId: 'k7KXJk_nhU4', module: '변수·입출력', title: '파이썬 3장 ①', desc: '변수와 계산기·퀴즈 프로그램.' },
    { id: 'p8', youtubeId: 'eYqkQgo82rc', module: '변수·입출력', title: '파이썬 3장 ②', desc: 'print() 함수 사용법 자세히 보기.' },
    { id: 'p9', youtubeId: 'tSzQHCAVibc', module: '변수·입출력', title: '3장 — 반복학습 부분', desc: '3장 핵심 내용 반복 학습.' },
    { id: 'p10', youtubeId: 'yqWinKLsx94', module: '변수·입출력', title: '3장 빠른 강의', desc: '3장 요점 빠르게 훑어보기.' },
    { id: 'p16', youtubeId: '6G1UjZ7vBo4', module: '변수·입출력', title: '파이썬 3장 학습정리', desc: '3장 핵심 내용 정리.' },
    { id: 'p11', youtubeId: 'NCrcJ9zWjpQ', module: '자료형', title: '4장 파이썬 자료의 종류', desc: '정수·실수·문자열·리스트와 형 변환.' },
    { id: 'p12', youtubeId: 'rIef9ejR8Kw', module: '자료형', title: '아나콘다 설치', desc: '가상환경을 위한 아나콘다 설치.' },
    { id: 'p13', youtubeId: 'RvzFpfGiZuo', module: '자료형', title: '주피터 노트북 실행', desc: '주피터 노트북으로 실습 환경 구축.' },
    { id: 'p14', youtubeId: '7o3GLnrnfII', module: '반복문·함수', title: '파이썬 반복문', desc: '반복문으로 반복 작업 처리하기.' },
    { id: 'p15', youtubeId: '4S05Z_N8ytw', module: '반복문·함수', title: '파이썬 함수와 딕셔너리', desc: '함수 정의와 딕셔너리 활용.' },
  ],
  // R 프로그래밍 (데이터 분석) — R프로그래밍 01~10 전체 연결 완료
  r: [
    { id: 'r1', youtubeId: 'RvFFsafGFYE', module: '기초', title: 'R 프로그래밍 01', desc: 'R 소개와 개발환경 준비.' },
    { id: 'r2', youtubeId: 'G0bFCr9KJYM', module: '기초', title: 'R 프로그래밍 02', desc: 'R 기본 문법과 자료구조.' },
    { id: 'r3', youtubeId: 'tvq6WzSCGGM', module: '기초', title: 'R 프로그래밍 03', desc: '벡터·데이터프레임 다루기.' },
    { id: 'r4', youtubeId: '7ZWr8MGJQDs', module: '기초', title: 'R 프로그래밍 04', desc: 'R 기초 04강.' },
    { id: 'r5', youtubeId: 'AQEABRVGtKU', module: '기초', title: 'R 프로그래밍 05', desc: '데이터 전처리와 가공.' },
    { id: 'r6', youtubeId: 'vp-2km_YQC8', module: '기초', title: 'R 프로그래밍 06', desc: '조건·반복과 함수 활용.' },
    { id: 'r7', youtubeId: 'K5iQpTYrX-A', module: '그래프', title: 'R 프로그래밍 07 — 그래프', desc: '데이터 시각화와 그래프 그리기.' },
    { id: 'r8', youtubeId: 'dFN4agORDJ8', module: '데이터 분석', title: 'R 08 — 한국복지패널 데이터 ①', desc: '복지패널 데이터 불러오기와 탐색.' },
    { id: 'r9', youtubeId: 'vzXYebb6DkA', module: '데이터 분석', title: 'R 09 — 한국복지패널 데이터 ②', desc: '변수 분석과 집단별 비교.' },
    { id: 'r10', youtubeId: 'oTZ4uPSbGXI', module: '데이터 분석', title: 'R 10 — 한국복지패널 데이터 ③', desc: '실전 분석과 결과 해석.' },
  ],
}

// 홈 화면 "추천 영상"
export const featured = [
  { topic: 'creation', videoId: 'c1' },
  { topic: 'creation', videoId: 'c14' },
  { topic: 'literacy', videoId: 'l1' },
  { topic: 'literacy', videoId: 'l8' },
]

// 페이지당 영상 수 (2 x 3 그리드 = 6개씩 페이지네이션)
export const PER_PAGE = 6
