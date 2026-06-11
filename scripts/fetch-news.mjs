// ============================================================
// 데스크 자동 수집 — src/data/news.json 생성
//  · 게임 뉴스: 루리웹 + 게임메카 RSS (한국어 게임 소식)
//  · 픽셀 신작/인기작: itch.io pixel-art 태그 RSS (영문 소개는 한글 자동번역)
//
// 실행: node scripts/fetch-news.mjs   (빌드 전 / GitHub Actions cron)
// 실패해도 기존 news.json을 유지하고 정상 종료(exit 0) — 빌드를 깨지 않음.
// 의존성 0 — RSS는 정규식으로 파싱 (두 피드 모두 구조 단순·일정)
// ============================================================
import { writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'news.json')

const UA = { headers: { 'User-Agent': 'pixelforge-press-bot' } }

// ── 공용 헬퍼 ──────────────────────────────────────────────
const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  if (!m) return ''
  return m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

const decodeEntities = (s) =>
  s
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

const stripHtml = (raw) =>
  decodeEntities(
    raw
      .replace(/<figcaption[\s\S]*?<\/figcaption>/g, '')
      .replace(/<img[\s\S]*?>/g, '')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()

const items = (xml) => [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])

// 영문 → 한글 자동번역 (구글 공개 엔드포인트, 실패 시 원문 유지)
async function toKorean(text) {
  if (!text || /[가-힣]/.test(text)) return text
  try {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=' +
      encodeURIComponent(text)
    const res = await fetch(url, UA)
    if (!res.ok) return text
    const data = await res.json()
    const translated = (data[0] || []).map((seg) => seg[0]).join('').trim()
    return translated || text
  } catch {
    return text
  }
}

// ── itch.io 픽셀 신작/인기작 ───────────────────────────────
async function fetchItch(url, limit = 12) {
  const res = await fetch(url, UA)
  if (!res.ok) throw new Error(`itch HTTP ${res.status}`)
  const xml = await res.text()
  const games = items(xml).slice(0, limit).map((it) => ({
    title: pick(it, 'plainTitle') || pick(it, 'title'),
    link: pick(it, 'link'),
    image: pick(it, 'imageurl'),
    price: pick(it, 'price'),
    desc: stripHtml(pick(it, 'description')).slice(0, 140),
    pubDate: pick(it, 'pubDate'),
  })).filter((g) => g.title && g.link)
  // 영문 소개를 한글로 (직렬 — 과한 요청 방지)
  for (const g of games) g.desc = (await toKorean(g.desc)).slice(0, 160)
  return games
}

// ── 2D 픽셀·도트 게임 뉴스 (구글 뉴스 검색 RSS) ────────────
// 키워드 검색이라 일반 매체 RSS보다 픽셀 관련 기사만 정확히 모임.
async function fetchGameNews(limit = 24) {
  const queries = ['픽셀 게임', '도트 게임', '픽셀아트 인디게임', '레트로 인디게임']
  const gnews = (q) =>
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`

  const all = []
  const seen = new Set()
  for (const q of queries) {
    try {
      const res = await fetch(gnews(q), UA)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const xml = await res.text()
      for (const it of items(xml)) {
        // 제목 끝의 " - 매체명"은 분리해서 출처 배지로
        const rawTitle = decodeEntities(pick(it, 'title'))
        const srcTag = decodeEntities(pick(it, 'source'))
        const title = srcTag && rawTitle.endsWith(` - ${srcTag}`)
          ? rawTitle.slice(0, -(srcTag.length + 3))
          : rawTitle
        const link = pick(it, 'link')
        if (!title || !link) continue
        // 중복 제거 (쿼리 간 겹침)
        const key = title.replace(/\s+/g, '').slice(0, 40)
        if (seen.has(key)) continue
        // 노이즈 컷: 회사명 매칭(엔픽셀·픽셀베리 등)만 있고 도트 게임 얘기가 아닌 기사
        if (!/(?<![가-힣A-Za-z])(픽셀|도트|레트로)|픽셀\s?아트|2D/i.test(title)) continue
        if (/엔픽셀|픽셀베리|하이픽셀/.test(title) && !/도트|픽셀\s?아트|레트로/.test(title)) continue
        seen.add(key)
        all.push({
          source: srcTag || '구글 뉴스',
          title,
          link,
          image: '', // 구글뉴스 RSS는 썸네일 미제공
          desc: '',
          pubDate: pick(it, 'pubDate'),
        })
      }
      console.log(`구글뉴스 "${q}": 수집 OK (누적 ${all.length})`)
    } catch (e) {
      console.log(`구글뉴스 "${q}" 실패(건너뜀): ${e.message}`)
    }
  }
  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  return all.slice(0, limit)
}

// ── main ───────────────────────────────────────────────────
async function main() {
  const result = {
    fetchedAt: new Date().toISOString(),
    gameNews: await fetchGameNews(),
    newest: await fetchItch('https://itch.io/games/newest/tag-pixel-art.xml'),
    top: await fetchItch('https://itch.io/games/top-rated/tag-pixel-art.xml'),
  }
  console.log(`게임뉴스 ${result.gameNews.length} / 신작 ${result.newest.length} / 인기 ${result.top.length}`)
  if (!result.gameNews.length && !result.newest.length) throw new Error('수집 결과 0건')
  writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`저장 완료 → ${OUT}`)
}

main().catch((e) => {
  console.error(`수집 실패: ${e.message}`)
  if (existsSync(OUT)) {
    console.error('기존 news.json 유지하고 빌드 계속 진행')
    process.exit(0)
  }
  writeFileSync(OUT, JSON.stringify({ fetchedAt: null, gameNews: [], newest: [], top: [] }, null, 2), 'utf-8')
  process.exit(0)
})
