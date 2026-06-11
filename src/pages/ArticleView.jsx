import { useParams, Link } from 'react-router-dom'
import { articleBySlug } from '../data/articles'
import ArticleEngagement from '../components/ArticleEngagement'

// 에디토리얼 기사 본문 + 반응/댓글
// '## '로 시작하는 문단은 소제목으로 렌더링

export default function ArticleView() {
  const { slug } = useParams()
  const article = articleBySlug(slug)

  if (!article) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-navy-500 dark:text-navy-300">기사를 찾을 수 없어요.</p>
        <Link to="/articles" className="btn-ghost mt-6 inline-flex">← 에디토리얼로</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="hero-soft border-b border-navy-100 dark:border-navy-700">
        <div className="container-x py-14 md:py-16">
          <p className="font-pixel mb-3 text-sm text-royal dark:text-sky">
            EDITORIAL · {article.category}
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-navy-900 dark:text-white md:text-4xl">
            {article.emoji} {article.title}
          </h1>
          <p className="mt-4 text-sm text-navy-400">
            PIXELFORGE PRESS 데스크 · {article.date}
          </p>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <article className="mx-auto max-w-3xl">
          {article.body.map((p, i) =>
            p.startsWith('## ') ? (
              <h2
                key={i}
                className="mb-4 mt-10 text-xl font-extrabold text-navy-900 dark:text-white"
              >
                {p.slice(3)}
              </h2>
            ) : (
              <p key={i} className="mb-5 leading-8 text-navy-700 dark:text-navy-200">
                {p}
              </p>
            )
          )}

          <ArticleEngagement articleId={`editorial:${article.slug}`} />

          <div className="mt-12">
            <Link to="/articles" className="btn-ghost">← 에디토리얼 목록</Link>
          </div>
        </article>
      </section>
    </div>
  )
}
