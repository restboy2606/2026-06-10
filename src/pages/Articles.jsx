import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

// 에디토리얼 — 데스크가 직접 쓰는 기사 목록

const catChip = {
  데브로그: 'bg-royal/15 text-royal',
  비하인드: 'bg-amber/20 text-amber-600',
  칼럼: 'bg-mint/20 text-mint-500',
}

export default function Articles() {
  return (
    <div>
      <section className="hero-soft border-b border-navy-100 dark:border-navy-700">
        <div className="container-x py-14 md:py-16">
          <p className="font-pixel mb-2 text-sm text-royal dark:text-sky">EDITORIAL</p>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
            에디토리얼
          </h1>
          <p className="mt-3 text-navy-600 dark:text-navy-300">
            게임을 만드는 사람이 직접 씁니다 — 데브로그·비하인드·칼럼.
          </p>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="surface group p-7 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`chip ${catChip[a.category] || 'bg-royal/15 text-royal'}`}>
                  {a.category}
                </span>
                <span className="text-xs text-navy-400">{a.date}</span>
              </div>
              <h2 className="mb-2 text-xl font-extrabold leading-snug text-navy-900 group-hover:text-royal dark:text-white dark:group-hover:text-sky md:text-2xl">
                {a.emoji} {a.title}
              </h2>
              <p className="text-sm leading-relaxed text-navy-500 dark:text-navy-300">
                {a.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-bold text-royal dark:text-sky">
                기사 읽기 →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
