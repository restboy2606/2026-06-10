import { useState, useEffect, useMemo } from 'react'
import { useParams, Navigate, NavLink } from 'react-router-dom'
import { topics, videos, PER_PAGE } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'
import Pagination from '../components/Pagination'

export default function Videos() {
  const { topic } = useParams()
  const meta = topics.find((t) => t.key === topic)

  const [moduleIdx, setModuleIdx] = useState(0) // 0 = 전체
  const [page, setPage] = useState(1)
  const [active, setActive] = useState(null)

  useEffect(() => {
    setModuleIdx(0)
    setPage(1)
  }, [topic])

  if (!meta) return <Navigate to={`/videos/${topics[0].key}`} replace />

  const subTabs = ['전체', ...meta.modules]
  const selectedModule = moduleIdx === 0 ? null : subTabs[moduleIdx]

  const list = videos[topic] || []
  const filtered = selectedModule ? list.filter((v) => v.module === selectedModule) : list
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))

  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  const selectModule = (i) => {
    setModuleIdx(i)
    setPage(1)
  }
  const changePage = (p) => {
    setPage(p)
    document.getElementById('video-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* 1) 주제 탭 (sticky) — 코스 전환 */}
      <div className="sticky top-16 z-30 border-b border-navy-100 bg-white/95 backdrop-blur dark:border-navy-700 dark:bg-navy-900/95 md:top-20">
        <div className="container-x">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto">
            {topics.map((t) => (
              <li key={t.key} className="shrink-0">
                <NavLink
                  to={`/videos/${t.key}`}
                  className={({ isActive }) =>
                    [
                      'block whitespace-nowrap border-b-2 px-4 py-4 text-sm font-bold transition md:text-base',
                      isActive
                        ? 'border-royal text-royal dark:border-sky dark:text-sky'
                        : 'border-transparent text-navy-600 hover:text-royal dark:text-navy-300 dark:hover:text-sky',
                    ].join(' ')
                  }
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2) 제목 + 한 줄 설명 / 3) 모듈 필터 / 4) 그리드 */}
      <section id="video-top" className="container-x scroll-mt-32 py-10 md:py-12">
        <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white md:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-500 dark:text-navy-300 md:text-base">
          {meta.desc}
        </p>

        {/* 모듈 필터 (작은 칩) */}
        <div className="mt-6 flex flex-wrap gap-2">
          {subTabs.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => selectModule(i)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-bold transition',
                i === moduleIdx
                  ? 'bg-royal text-white shadow-glow'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mb-6 mt-5 text-sm font-medium text-navy-400">
          총 {filtered.length}개 강의 · {page}/{totalPages} 페이지
        </p>

        {/* 영상 그리드 (2 x 3 = 6개씩) — 모바일 1열, 그 외 2열 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {pageItems.map((v) => (
            <div key={v.id} className="animate-fadeUp">
              <VideoCard video={v} onPlay={setActive} />
            </div>
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
      </section>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  )
}
