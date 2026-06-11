import { Link } from 'react-router-dom'
import { company, topics } from '../data/site'

// ============================================================
// 푸터 (rest03 패턴) — 상단: 로고+소개문 / 하단: 다크 영역
//  하단: 연락처 · 영상강의 · 바로가기/패밀리사이트 · 사업자정보 · 정책/카피라이트
//  회사정보 출처: www.dreamitbiz.com
// ============================================================
export default function Footer() {
  const { operator } = company

  return (
    <footer>
      {/* 상단 소개 영역 (밝음) */}
      <div className="container-x py-16 md:py-20">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-pixel flex h-10 w-10 items-center justify-center rounded-md bg-royal text-xl text-white pixel-shadow">
              P
            </span>
            <span className="font-pixel text-xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-2xl">
              {company.name}
            </span>
          </div>
          <div className="flex-grow text-base leading-7 text-navy-600 dark:text-navy-300 md:text-[1.05rem]">
            {company.intro.map((p, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 다크 영역 */}
      <div className="bg-navy-950 text-navy-300">
        <div className="container-x flex flex-col gap-10 py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* 연락처 */}
            <div className="text-sm">
              <h4 className="mb-4 font-extrabold uppercase tracking-wider text-navy-100">연락처</h4>
              <ul className="flex flex-col gap-2">
                <li>
                  ✉️{' '}
                  <a href={`mailto:${company.email}`} className="hover:text-sky">
                    {company.email}
                  </a>
                </li>
                <li>📞 {company.tel}</li>
                <li>💬 카카오톡: {company.kakao}</li>
                <li className="text-navy-400">🕘 {company.hours}</li>
              </ul>
            </div>

            {/* 영상 강의 */}
            <div className="text-sm">
              <h4 className="mb-4 font-extrabold uppercase tracking-wider text-navy-100">
                영상 강의
              </h4>
              <ul className="flex flex-col gap-2">
                {topics.map((t) => (
                  <li key={t.key}>
                    <Link to={`/videos/${t.key}`} className="hover:text-sky">
                      {t.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/about" className="hover:text-sky">
                    회사소개
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-sky">
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>

            {/* 패밀리 사이트 + 소셜 */}
            <div className="text-sm">
              <h4 className="mb-4 font-extrabold uppercase tracking-wider text-navy-100">
                패밀리 사이트
              </h4>
              <select
                aria-label="패밀리 사이트"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) window.open(e.target.value, '_blank', 'noopener')
                }}
                className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 font-bold text-navy-200 outline-none transition focus:border-sky"
              >
                <option value="" disabled>
                  바로가기 선택
                </option>
                {company.familySites.map((f) => (
                  <option key={f.url} value={f.url} className="text-black">
                    {f.name}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex gap-4">
                {company.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-navy-100 hover:text-sky"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 운영사 사업자 정보 */}
          <div className="border-t border-navy-800 pt-6 text-xs leading-6 text-navy-400">
            <p className="mb-1 font-bold text-navy-200">
              {operator.nameKo} ({operator.nameEn})
              <a
                href={operator.site}
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-medium text-navy-400 hover:text-sky"
              >
                게임사 홈 →
              </a>
            </p>
            <p>대표: {operator.ceo} · {operator.ceoTitle}</p>
            <p className="mt-1 text-navy-500">{operator.note}</p>
          </div>

          {/* 정책 링크 + 카피라이트 */}
          <div className="flex flex-col justify-between gap-4 border-t border-navy-800 pt-5 text-sm md:flex-row md:items-center">
            <ul className="flex">
              {company.footerLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className={[
                      'px-5 first:pl-0',
                      l.strong ? 'font-black text-white' : 'font-medium text-navy-400 hover:text-white',
                    ].join(' ')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-navy-500">{company.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
