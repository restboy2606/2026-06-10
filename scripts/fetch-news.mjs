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

// ── 한국 게임 뉴스 (루리웹 + 게임메카) ─────────────────────
async function fetchGameNews(limit = 14) {
  const sources = [
    {
      name: '루리웹',
      url: 'https://bbs.ruliweb.com/news/rss',
      image: (it) => {
        const m = pick(it, 'description').match(/src="(\/\/[^"]+|https?:[^"]+)"/)
        return m ? (m[1].startsWith('//') ? 'https:' + m[1] : m[1]) : ''
      },
    },
    {
      name: '게임메카',
      url: 'https://www.gamemeca.com/rss.php',
      image: (it) => pick(it, 'url'), // <image><url>…</url></image>
    },
  ]

  const all = []
  for (const s of sources) {
    try {
      const res = await fetch(s.url, UA)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const xml = await res.text()
      for (const it of items(xml).slice(0, limit)) {
        const title = decodeEntities(pick(it, 'title'))
        const link = pick(it, 'link')
        if (!title || !link) continue
        all.push({
          source: s.name,
          title,
          link,
          image: s.image(it),
          desc: stripHtml(pick(it, 'description')).slice(0, 150),
          pubDate: pick(it, 'pubDate'),
        })
      }
      console.log(`${s.name}: 수집 OK`)
    } catch (e) {
      console.log(`${s.name} 실패(건너뜀): ${e.message}`)
    }
  }
  // 최신순 정렬 후 픽셀·인디 키워드 기사를 살짝 앞으로
  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  const boost = (n) => (/픽셀|도트|인디|레트로/i.test(n.title + n.desc) ? 0 : 1)
  all.sort((a, b) => boost(a) - boost(b) || new Date(b.pubDate) - new Date(a.pubDate))
  return all.slice(0, limit * 2)
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
