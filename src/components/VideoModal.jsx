import { useEffect } from 'react'

// 동영상 재생 모달 — 유튜브 임베드 (미등록/링크공개 영상 재생 가능)
export default function VideoModal({ video, onClose }) {
  // ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!video) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [video, onClose])

  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl animate-pop overflow-hidden rounded-2xl bg-navy-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <h3 className="text-lg font-bold text-white">{video.title}</h3>
            <p className="mt-0.5 text-sm text-navy-300">{video.desc}</p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xl text-white transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        {/* 플레이어 (16:9) */}
        <div className="aspect-video w-full bg-black">
          {video.youtubeId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-navy-300">
              <span className="text-4xl">🎬</span>
              <p className="text-sm">
                아직 영상이 연결되지 않았습니다.
                <br />
                <code className="text-amber">site.js</code> 의 youtubeId 를 입력하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
