import { useState } from 'react'

// 레벨/모듈 뱃지 색상 (레벨이 있으면 매핑, 없으면 기본 로열)
const levelStyle = {
  입문: 'bg-mint/20 text-mint-500',
  기초: 'bg-sky/20 text-sky-700 dark:text-sky',
  중급: 'bg-royal/15 text-royal',
  심화: 'bg-amber/20 text-amber-600',
}

// 동영상 카드 — 썸네일(있으면 유튜브, 없으면 그라데이션) + 정보, 클릭 시 모달 재생
export default function VideoCard({ video, onPlay }) {
  const [thumbError, setThumbError] = useState(false)
  const hasThumb = video.youtubeId && !thumbError

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group surface flex flex-col overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-royal"
    >
      {/* 썸네일 (16:9) */}
      <div className="relative aspect-video overflow-hidden">
        {hasThumb ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            loading="lazy"
            onError={() => setThumbError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="hero-gradient flex h-full w-full items-center justify-center">
            <span className="px-4 text-center text-sm font-bold text-white/70">
              {video.title}
            </span>
          </div>
        )}

        {/* 재생 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition group-hover:bg-navy-950/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-royal opacity-0 shadow-lg transition group-hover:opacity-100 group-hover:scale-100 scale-90">
            ▶
          </span>
        </div>

        {/* 재생시간 */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-navy-950/80 px-1.5 py-0.5 text-xs font-bold text-white">
            {video.duration}
          </span>
        )}

        {/* 영상 미연결(준비중) 배지 */}
        {!video.youtubeId && (
          <span className="absolute left-2 top-2 rounded bg-amber px-2 py-0.5 text-xs font-bold text-navy-900">
            준비중
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          {(video.module || video.level) && (
            <span
              className={`chip ${
                levelStyle[video.level] || 'bg-royal/10 text-royal dark:bg-royal/20 dark:text-sky'
              }`}
            >
              {video.module || video.level}
            </span>
          )}
        </div>
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold leading-snug text-navy-900 dark:text-white">
          {video.title}
        </h3>
        <p className="line-clamp-2 text-sm text-navy-500 dark:text-navy-300">{video.desc}</p>
      </div>
    </button>
  )
}
