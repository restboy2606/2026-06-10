import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company, features, topics, videos, featured } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'

// 주제 accent → 정적 Tailwind 클래스 (동적 클래스는 purge 되므로 매핑 사용)
const accentChip = {
  royal: 'bg-royal/15 text-royal',
  sky: 'bg-sky/20 text-sky-700 dark:text-sky',
  mint: 'bg-mint/20 text-mint-500',
  amber: 'bg-amber/20 text-amber-600',
}

// featured 정의에서 실제 영상 객체 찾기
function resolveFeatured() {
  return featured
    .map((f) => {
      const v = (videos[f.topic] || []).find((x) => x.id === f.videoId)
      return v ? { ...v, topic: f.topic } : null
    })
    .filter(Boolean)
}

export default function Home() {
  const [active, setActive] = useState(null)
  const featuredVideos = resolveFeatured()

  return (
    <div>
      {/* 히어로 */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-10 py-20 md:py-28 lg:grid-cols-2">
          <div className="animate-fadeUp">
            <p className="eyebrow !bg-white/15 !text-sky">PIXEL × AI LEARNING</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              게임처럼 배우는
              <br />
              AI 한 판
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              {company.tagline}. 기초부터 실무, AI 리터러시까지 — 검증된 동영상 강의로 지금 시작하세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/videos/${topics[0].key}`} className="btn-primary">
                영상 강의 보기 ▶
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                회사소개
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">5+</div>
                <div className="text-navy-200">학습 주제</div>
              </div>
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">
                  {Object.values(videos).reduce((a, b) => a + b.length, 0)}+
                </div>
                <div className="text-navy-200">동영상 강의</div>
              </div>
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">24/7</div>
                <div className="text-navy-200">언제든 시청</div>
              </div>
            </div>
          </div>

          {/* 히어로 비주얼 카드 */}
          <div className="relative hidden lg:block">
            <div className="surface !bg-white/10 !border-white/20 animate-pop p-6 backdrop-blur">
              <div className="hero-gradient mb-4 flex aspect-video items-center justify-center rounded-xl border border-white/10">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-3xl text-royal">
                  ▶
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-white/30" />
                <div className="h-3 w-1/2 rounded bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="container-x py-16 md:py-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="surface p-6">
              <div className="mb-3 text-4xl">{f.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-navy-900 dark:text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-navy-500 dark:text-navy-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 주제별 둘러보기 */}
      <section className="bg-navy-50 py-16 dark:bg-navy-900 md:py-24">
        <div className="container-x">
          <div className="mb-10 text-center">
            <p className="eyebrow">CURRICULUM</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
              주제별로 만나는 강의
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <Link
                key={t.key}
                to={`/videos/${t.key}`}
                className="surface group flex flex-col p-8 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <span className={`chip mb-4 w-fit ${accentChip[t.accent] || accentChip.royal}`}>
                  {(videos[t.key] || []).length}개 강의
                </span>
                <h3 className="mb-2 text-xl font-bold text-navy-900 dark:text-white">{t.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-navy-500 dark:text-navy-300">
                  {t.desc}
                </p>
                <span className="mt-5 text-sm font-bold text-royal transition group-hover:gap-2 dark:text-sky">
                  강의 보러가기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 영상 */}
      {featuredVideos.length > 0 && (
        <section className="container-x py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">PICK</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
                추천 영상
              </h2>
            </div>
            <Link
              to={`/videos/${topics[0].key}`}
              className="hidden text-sm font-bold text-royal hover:underline dark:text-sky sm:block"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVideos.map((v) => (
              <VideoCard key={v.id} video={v} onPlay={setActive} />
            ))}
          </div>
        </section>
      )}

      {/* CTA 배너 */}
      <section className="container-x pb-20">
        <div className="hero-gradient flex flex-col items-center gap-5 rounded-3xl px-6 py-14 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">지금, 첫 판을 시작하세요</h2>
          <p className="max-w-xl text-navy-100">
            모바일에서도 끊김 없이, 라이트·다크 모드로 편안하게. 픽셀포지 아카데미와 함께 한 판씩 깨다 보면 누구나 AI에 한 걸음 가까워집니다.
          </p>
          <Link to={`/videos/${topics[0].key}`} className="btn-primary !bg-amber !text-navy-900 hover:!bg-amber-300">
            무료로 강의 둘러보기
          </Link>
        </div>
      </section>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  )
}
