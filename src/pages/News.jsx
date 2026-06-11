import { useState } from 'react'
import news from '../data/news.json'

// 신작 데스크 — itch.io 픽셀아트 태그에서 자동 수집 (scripts/fetch-news.mjs)
// 어그리게이터 방식: 썸네일+제목+요약+원문 링크 (전문 복제 없음)

const TABS = [
  { key: 'gameNews', label: '📰 게임 뉴스' },
  { key: 'newest', label: '🆕 따끈한 신작' },
  { key: 'top', label: '🏆 명예의 전당' },
]

const fmtDate = (s) => {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d)) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function News() {
  const [tab, setTab] = useState('gameNews')
  const items = news[tab] || []
  const fetched = fmtDate(news.fetchedAt)
  const isNewsTab = tab === 'gameNews'

  return (
    <div>
      <section className="hero-soft border-b border-navy-100 dark:border-navy-700">
        <div className="container-x py-14 md:py-16">
          <p className="font-pixel mb-2 text-sm text-royal dark:text-sky">NEWS DESK</p>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
            신작 데스크
          </h1>
          <p className="mt-3 text-navy-600 dark:text-navy-300">
            게임 뉴스와 픽셀 신작·인기작을 데스크 봇이 매일 수집합니다.
            {fetched && <span className="ml-2 text-sm text-navy-400">최근 수집: {fetched}</span>}
          </p>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="mb-7 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={[
                'rounded-full px-4 py-2 text-sm font-bold transition',
                tab === t.key
                  ? 'bg-royal text-white'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-navy-400">
            수집된 기사가 없어요. 데스크 봇이 곧 출근합니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => (
              <a
                key={g.link}
                href={g.link}
                target="_blank"
                rel="noreferrer"
                className="surface group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
              >
                {g.image ? (
                  <div className={`${isNewsTab ? 'aspect-video' : 'aspect-[315/250]'} overflow-hidden bg-navy-100 dark:bg-navy-800`}>
                    <img
                      src={g.image}
                      alt={g.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      style={isNewsTab ? undefined : { imageRendering: 'pixelated' }}
                    />
                  </div>
                ) : (
                  isNewsTab && (
                    <div className="hero-gradient flex aspect-[5/1.6] items-center justify-center">
                      <span className="font-pixel text-sm tracking-widest text-white/80">
                        PIXEL NEWS 🗞️
                      </span>
                    </div>
                  )
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="chip bg-royal/15 text-royal">
                      {isNewsTab ? g.source : g.price === '$0.00' ? 'FREE' : g.price}
                    </span>
                    <span className="text-xs text-navy-400">{fmtDate(g.pubDate)}</span>
                  </div>
                  <h3 className="mb-1.5 font-bold leading-snug text-navy-900 dark:text-white">
                    {g.title}
                  </h3>
                  {g.desc && (
                    <p className="flex-1 text-sm leading-relaxed text-navy-500 dark:text-navy-300">
                      {g.desc}
                    </p>
                  )}
                  <span className="mt-4 text-xs font-bold text-royal dark:text-sky">
                    {isNewsTab ? '기사 원문 보기 ↗' : 'itch.io에서 보기 ↗'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-navy-400">
          {isNewsTab
            ? '출처: 루리웹·게임메카 공개 RSS — 제목·요약·썸네일만 표시하며 본문은 원문 링크에서 읽을 수 있습니다.'
            : '출처: itch.io 공개 RSS · 썸네일과 소개문의 저작권은 각 개발자에게 있습니다. 영문 소개는 자동 번역됩니다.'}
        </p>
      </section>
    </div>
  )
}
