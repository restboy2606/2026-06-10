import { Link } from 'react-router-dom'
import { company, features, topics } from '../data/site'

export default function About() {
  return (
    <div>
      {/* 헤드 */}
      <section className="hero-soft border-b border-navy-100 dark:border-navy-700">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">ABOUT US</p>
          <h1 className="mt-4 text-3xl font-extrabold text-navy-900 dark:text-white md:text-5xl">
            {company.nameKo}
          </h1>
          <p className="mt-3 text-lg text-navy-600 dark:text-navy-200">{company.tagline}</p>
        </div>
      </section>

      {/* 소개 */}
      <section className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-extrabold text-navy-900 dark:text-white md:text-3xl">
            우리는 이런 교육을 합니다
          </h2>
          <div className="space-y-4 text-base leading-8 text-navy-600 dark:text-navy-300 md:text-lg">
            {company.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 강점 */}
      <section className="bg-navy-50 py-16 dark:bg-navy-900 md:py-24">
        <div className="container-x">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-navy-900 dark:text-white md:text-3xl">
            픽셀포지 아카데미의 약속
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="surface p-6">
                <div className="mb-3 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-navy-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-navy-500 dark:text-navy-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 커리큘럼 요약 */}
      <section className="container-x py-16 md:py-24">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-navy-900 dark:text-white md:text-3xl">
          학습 주제
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t, i) => (
            <Link
              key={t.key}
              to={`/videos/${t.key}`}
              className="surface flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal/10 text-lg font-extrabold text-royal dark:bg-royal/20 dark:text-sky">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-bold text-navy-900 dark:text-white">{t.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-300">{t.headline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
