// ============================================================
// 신작 데스크 자동 수집 — itch.io 픽셀아트 태그 RSS → src/data/news.json
//
// 실행: node scripts/fetch-news.mjs   (빌드 전 / GitHub Actions cron)
// 실패해도 기존 news.json을 유지하고 정상 종료(exit 0) — 빌드를 깨지 않음.
// 의존성 0 — XML은 정규식으로 충분히 파싱됨 (itch RSS 구조가 단순·일정함)
// ============================================================
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'news.json')

const FEEDS = {
  newest: 'https://itch.io/games/newest/tag-pixel-art.xml',
  top: 'https://itch.io/games/top-rated/tag-pixel-art.xml',
}

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  if (!m) return ''
  return m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

// description에서 HTML 태그 제거 후 첫 줄만
const cleanDesc = (raw) =>
  raw
    .replace(/<img[\s\S]*?\/>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim()
    .split('\n')[0]
    .slice(0, 140)

function parseFeed(xml, limit = 12) {
  const items = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = re.exec(xml)) && items.length < limit) {
    const it = m[1]
    items.push({
      title: pick(it, 'plainTitle') || pick(it, 'title'),
      link: pick(it, 'link'),
      image: pick(it, 'imageurl'),
      price: pick(it, 'price'),
      desc: cleanDesc(pick(it, 'description')),
      pubDate: pick(it, 'pubDate'),
    })
  }
  return items.filter((i) => i.title && i.link)
}

async function main() {
  const result = { fetchedAt: new Date().toISOString(), newest: [], top: [] }
  for (const [key, url] of Object.entries(FEEDS)) {
    const res = await fetch(url, { headers: { 'User-Agent': 'pixelforge-press-bot' } })
    if (!res.ok) throw new Error(`${key} feed HTTP ${res.status}`)
    result[key] = parseFeed(await res.text())
    console.log(`${key}: ${result[key].length}건 수집`)
  }
  if (!result.newest.length && !result.top.length) throw new Error('수집 결과 0건')
  writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`저장 완료 → ${OUT}`)
}

main().catch((e) => {
  console.error(`수집 실패: ${e.message}`)
  if (existsSync(OUT)) {
    console.error('기존 news.json 유지하고 빌드 계속 진행')
    process.exit(0) // 빌드를 깨지 않음
  }
  // 파일조차 없으면 빈 구조라도 만들어서 빌드 가능하게
  writeFileSync(OUT, JSON.stringify({ fetchedAt: null, newest: [], top: [] }, null, 2), 'utf-8')
  process.exit(0)
})
