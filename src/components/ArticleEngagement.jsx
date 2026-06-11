import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

// 기사 하단 반응 버튼 + 회원 전용 댓글
// 쓰기 권한은 전부 RLS가 강제 — 여기 UI 조건은 편의일 뿐

const REACTIONS = [
  { kind: 'like', emoji: '👍', label: '추천' },
  { kind: 'fire', emoji: '🔥', label: '뜨겁다' },
  { kind: 'retro', emoji: '🕹️', label: '도트맛' },
]

const fmtDate = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function ArticleEngagement({ articleId }) {
  const { session, isAdmin } = useAuth()
  const [reactions, setReactions] = useState([]) // [{kind, user_id}]
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    const [r, c] = await Promise.all([
      supabase.from('pf_article_reactions').select('kind, user_id').eq('article_id', articleId),
      supabase
        .from('pf_article_comments')
        .select('id, content, created_at, author_id, author:pf_profiles(nickname)')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true }),
    ])
    if (r.error || c.error) setErr((r.error || c.error).message)
    else {
      setReactions(r.data || [])
      setComments(c.data || [])
    }
  }, [articleId])

  useEffect(() => { load() }, [load])

  async function toggleReaction(kind) {
    if (!session) { setErr('반응을 남기려면 로그인하세요. (우측 상단)'); return }
    setErr('')
    const mine = reactions.find((r) => r.kind === kind && r.user_id === session.user.id)
    if (mine) {
      const { error } = await supabase
        .from('pf_article_reactions')
        .delete()
        .eq('article_id', articleId).eq('user_id', session.user.id).eq('kind', kind)
      if (error) { setErr(error.message); return }
    } else {
      const { error } = await supabase
        .from('pf_article_reactions')
        .insert({ article_id: articleId, user_id: session.user.id, kind })
      if (error) { setErr(error.message); return }
    }
    load()
  }

  async function addComment() {
    if (!text.trim() || busy) return
    setBusy(true)
    setErr('')
    const { error } = await supabase.from('pf_article_comments').insert({
      article_id: articleId,
      author_id: session.user.id,
      content: text.trim(),
    })
    setBusy(false)
    if (error) setErr(error.message)
    else { setText(''); load() }
  }

  async function removeComment(id) {
    const { error } = await supabase.from('pf_article_comments').delete().eq('id', id)
    if (error) setErr(error.message)
    else load()
  }

  const countOf = (kind) => reactions.filter((r) => r.kind === kind).length
  const mineHas = (kind) =>
    session && reactions.some((r) => r.kind === kind && r.user_id === session.user.id)

  return (
    <div className="mt-12 border-t border-navy-100 pt-8 dark:border-navy-700">
      {/* 반응 버튼 */}
      <div className="flex flex-wrap items-center gap-2">
        {REACTIONS.map((r) => (
          <button
            key={r.kind}
            type="button"
            onClick={() => toggleReaction(r.kind)}
            className={[
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition',
              mineHas(r.kind)
                ? 'border-royal bg-royal/10 text-royal dark:border-sky dark:text-sky'
                : 'border-navy-200 text-navy-600 hover:border-royal hover:text-royal dark:border-navy-600 dark:text-navy-200 dark:hover:border-sky dark:hover:text-sky',
            ].join(' ')}
          >
            <span>{r.emoji}</span>
            <span>{r.label}</span>
            <span className="font-pixel text-xs opacity-70">{countOf(r.kind)}</span>
          </button>
        ))}
      </div>

      {err && (
        <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400">
          {err}
        </p>
      )}

      {/* 댓글 */}
      <h3 className="mb-3 mt-10 font-bold text-navy-900 dark:text-white">
        댓글 {comments.length}
      </h3>
      <ul className="mb-5 divide-y divide-navy-100 dark:divide-navy-700">
        {comments.map((c) => (
          <li key={c.id} className="py-3">
            <p className="text-xs text-navy-400">
              {c.author?.nickname} · {fmtDate(c.created_at)}
              {(session?.user?.id === c.author_id || isAdmin) && (
                <button
                  type="button"
                  onClick={() => removeComment(c.id)}
                  className="ml-2 underline hover:text-red-500"
                >
                  삭제
                </button>
              )}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-navy-800 dark:text-navy-100">
              {c.content}
            </p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="py-4 text-sm text-navy-400">아직 댓글이 없어요. 첫 의견을 남겨보세요!</li>
        )}
      </ul>

      {session ? (
        <div className="flex gap-2">
          <input
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-royal dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            placeholder="댓글 달기 (회원 전용)"
            value={text}
            maxLength={1000}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
          />
          <button
            type="button"
            onClick={addComment}
            disabled={busy}
            className="shrink-0 rounded-lg bg-royal px-5 text-sm font-bold text-white transition hover:bg-royal/90 disabled:opacity-40"
          >
            등록
          </button>
        </div>
      ) : (
        <p className="text-sm text-navy-400">
          댓글은 길드 회원만 쓸 수 있어요 — 우측 상단에서 로그인하세요.
        </p>
      )}
    </div>
  )
}
