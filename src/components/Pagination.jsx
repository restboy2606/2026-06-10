// 페이지네이션 — 처음/이전/번호/다음/마지막
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  // 현재 페이지 주변 번호 윈도우 (최대 5개)
  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  let end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const go = (p) => onChange(Math.min(totalPages, Math.max(1, p)))

  const navBtn =
    'rounded-lg border border-navy-200 px-3 py-2 text-sm font-bold text-navy-600 transition hover:border-royal hover:text-royal disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-navy-200 dark:hover:border-sky dark:hover:text-sky'

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="페이지네이션">
      <button type="button" className={navBtn} onClick={() => go(1)} disabled={page === 1}>
        «
      </button>
      <button type="button" className={navBtn} onClick={() => go(page - 1)} disabled={page === 1}>
        ‹
      </button>

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
          className={[
            'h-10 w-10 rounded-lg text-sm font-bold transition',
            p === page
              ? 'bg-royal text-white shadow-glow'
              : 'border border-navy-200 text-navy-600 hover:border-royal hover:text-royal dark:border-navy-600 dark:text-navy-200 dark:hover:border-sky dark:hover:text-sky',
          ].join(' ')}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className={navBtn}
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
      >
        ›
      </button>
      <button
        type="button"
        className={navBtn}
        onClick={() => go(totalPages)}
        disabled={page === totalPages}
      >
        »
      </button>
    </nav>
  )
}
