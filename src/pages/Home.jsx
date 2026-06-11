import { Link } from 'react-router-dom'
import { company, features } from '../data/site'
import { articles } from '../data/articles'
import news from '../data/news.json'

// PIXELFORGE PRESS 프론트 페이지 — 웹진 1면

const catChip = {
  데브로그: 'bg-royal/15 text-royal',
  비하인드: 'bg-amber/20 text-amber-600',
  칼럼: 'bg-mint/20 text-mint-500',
}

export default function Home() {
  const headline = articles[0]
  const subArticles = articles.slice(1)
  const freshGames = (news.newest || []).slice(0, 6)

  return (
    <div>
      {/* 히어로 — 1면 헤드라인 */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-10 py-20 md:py-28 lg:grid-cols-2">
          <div className="animate-fadeUp">
            <p className="eyebrow !bg-white/15 !text-sky">2D PIXEL GAMES WEBZINE</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              도트 한 점까지
              <br />
              전부 기사가 된다
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              {company.tagline}. 매일 갱신되는 신작 데스크부터 개발 현장의 데브로그까지.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/news" className="btn-primary">
                신작 데스크 보기 🗞️
              </Link>
              <Link
                to="/articles"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                에디토리얼
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">
                  {(news.gameNews || []).length + (news.newest || []).length + (news.top || []).length}
                </div>
                <div className="text-navy-200">오늘의 수집 기사</div>
              </div>
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">{articles.length}</div>
                <div className="text-navy-200">에디토리얼</div>
              </div>
              <div>
                <div className="font-pixel text-3xl font-extrabold text-amber">DAILY</div>
                <div className="text-navy-200">자동 갱신</div>
              </div>
            </div>
          </div>

          {/* 헤드라인 기사 카드 */}
          {headline && (
            <div className="relative hidden lg:block">
              <Link
                to={`/articles/${headline.slug}`}
                className="surface !bg-white/10 !border-white/20 animate-pop block p-7 backdrop-blur transition hover:!bg-white/15"
              >
                <p className="font-pixel mb-3 text-xs text-amber">TODAY'S HEADLINE</p>
                <h2 className="text-2xl font-extrabold leading-snug text-white">
                  {headline.emoji} {headline.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-100">{headline.excerpt}</p>
                <span className="mt-5 inline-block text-sm font-bold text-sky">기사 읽기 →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 데스크 소개 */}
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

      {/* 신작 데스크 미리보기 */}
      {freshGames.length > 0 && (
        <section className="bg-navy-50 py-16 dark:bg-navy-900 md:py-24">
          <div className="container-x">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">NEWS DESK</p>
                <h2 className="mt-3 text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
                  방금 들어온 픽셀 신작
                </h2>
              </div>
              <Link
                to="/news"
                className="hidden text-sm font-bold text-royal hover:underline dark:text-sky sm:block"
              >
                전체보기 →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {freshGames.map((g) => (
                <a
                  key={g.link}
                  href={g.link}
                  target="_blank"
                  rel="noreferrer"
                  className="surface group overflow-hidden transition hover:-translate-y-1"
                >
                  {g.image && (
                    <div className="aspect-[315/250] overflow-hidden bg-navy-100 dark:bg-navy-800">
                      <img
                        src={g.image}
                        alt={g.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                  )}
                  <p className="truncate p-3 text-xs font-bold text-navy-800 dark:text-navy-100">
                    {g.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 에디토리얼 */}
      {subArticles.length > 0 && (
        <section className="container-x py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">EDITORIAL</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
                데스크의 기사
              </h2>
            </div>
            <Link
              to="/articles"
              className="hidden text-sm font-bold text-royal hover:underline dark:text-sky sm:block"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {subArticles.map((a) => (
              <Link
                key={a.slug}
                to={`/articles/${a.slug}`}
                className="surface group flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <span className={`chip mb-4 w-fit ${catChip[a.category] || 'bg-royal/15 text-royal'}`}>
                  {a.category}
                </span>
                <h3 className="mb-2 text-xl font-bold leading-snug text-navy-900 group-hover:text-royal dark:text-white dark:group-hover:text-sky">
                  {a.emoji} {a.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-navy-500 dark:text-navy-300">
                  {a.excerpt}
                </p>
                <span className="mt-5 text-sm font-bold text-royal dark:text-sky">기사 읽기 →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA — 회원 가입 */}
      <section className="container-x pb-20">
        <div className="hero-gradient flex flex-col items-center gap-5 rounded-3xl px-6 py-14 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">독자가 되어주세요</h2>
          <p className="max-w-xl text-navy-100">
            회원이 되면 기사에 반응과 댓글을 남기고, 자유게시판에서 제보·토론에 참여할 수 있습니다.
            카카오 로그인으로 3초면 충분해요.
          </p>
          <Link to="/community" className="btn-primary !bg-amber !text-navy-900 hover:!bg-amber-300">
            자유게시판 가기 ⚔️
          </Link>
        </div>
      </section>
    </div>
  )
}
