import { useState, useEffect, useCallback } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

// 길드 게시판 — 공지사항 / 커뮤니티 / 학습 Q&A
// 인증·권한은 전부 Supabase(카카오 OAuth + RLS)가 담당

const CATEGORIES = [
  { key: 'notice', label: '공지사항', emoji: '📜' },
  { key: 'community', label: '커뮤니티', emoji: '⚔️' },
  { key: 'qna', label: '학습 Q&A', emoji: '💡' },
]

const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key

const fmtDate = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function Community() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('community')
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('list') // list | write | post
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setProfile(null); return }
    supabase.from('pf_profiles').select('*').eq('id', session.user.id).single()
      .then(({ data }) => setProfile(data))
  }, [session])

  const loadPosts = useCallback(async (category) => {
    if (!supabase) { setLoading(false); return }
    setLoading(true)
    setErr('')
    const { data, error } = await supabase
      .from('pf_posts')
      .select('id, title, category, created_at, author:pf_profiles(nickname)')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) setErr(error.message)
    else setPosts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadPosts(tab) }, [tab, loadPosts])

  async function login() {
    setErr('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.href,
        // 카카오 앱에 email 권한 없음(비즈 인증 필요) → 기본 스코프에서 account_email 제외
        scopes: 'profile_nickname profile_image',
      },
    })
    if (error) setErr(error.message)
  }

  async function logout() {
    await supabase.auth.signOut()
    setView('list')
  }

  async function openPost(id) {
    setErr('')
    const { data, error } = await supabase
      .from('pf_posts')
      .select('*, author:pf_profiles(nickname, role), comments:pf_comments(id, content, created_at, author_id, author:pf_profiles(nickname))')
      .eq('id', id).single()
    if (error) { setErr(error.message); return }
    data.comments.sort((a, b) => a.created_at.localeCompare(b.created_at))
    setCurrent(data)
    setView('post')
  }

  return (
    <div>
      {/* 헤더 영역 */}
      <section className="hero-soft border-b border-navy-100 dark:border-navy-700">
        <div className="container-x py-14 md:py-16">
          <p className="font-pixel mb-2 text-sm text-royal dark:text-sky">GUILD BOARD</p>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white md:text-4xl">
            길드 게시판
          </h1>
          <p className="mt-3 text-navy-600 dark:text-navy-300">
            공지 확인하고, 자유롭게 떠들고, 막히는 건 길드원에게 물어보세요.
          </p>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {!isConfigured ? (
            <p className="rounded-xl border border-navy-100 bg-navy-50 p-6 leading-7 text-navy-600 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-300">
              ⚠️ Supabase anon key가 설정되지 않았어요. <code>src/lib/supabase.js</code>를 확인하세요.
            </p>
          ) : (
            <>
              {/* 로그인 상태 바 */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                {session ? (
                  <>
                    <span className="font-bold text-navy-800 dark:text-navy-100">
                      🛡 {profile?.nickname || '...'}
                      {isAdmin && (
                        <em className="font-pixel ml-2 rounded border border-royal px-1.5 py-0.5 text-[10px] not-italic text-royal dark:border-sky dark:text-sky">
                          GUILD MASTER
                        </em>
                      )}
                    </span>
                    <button type="button" onClick={logout} className="btn-ghost text-sm">
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-navy-600 dark:text-navy-300">
                      로그인하면 글과 댓글을 쓸 수 있어요.
                    </span>
                    <button
                      type="button"
                      onClick={login}
                      className="rounded-lg bg-[#FEE500] px-5 py-2.5 text-sm font-extrabold text-[#191919] transition hover:opacity-85"
                    >
                      카카오로 시작하기
                    </button>
                  </>
                )}
              </div>

              {err && (
                <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400">
                  {err}
                </p>
              )}

              {view === 'list' && (
                <>
                  {/* 카테고리 탭 */}
                  <div className="mb-5 flex gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => { setTab(c.key); setView('list') }}
                        className={[
                          'rounded-full px-4 py-2 text-sm font-bold transition',
                          tab === c.key
                            ? 'bg-royal text-white'
                            : 'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700',
                        ].join(' ')}
                      >
                        {c.emoji} {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-pixel text-xs text-navy-400 dark:text-navy-500">
                      {posts.length} POSTS
                    </span>
                    {session && (tab !== 'notice' || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => setView('write')}
                        className="rounded-lg bg-royal px-4 py-2 text-sm font-bold text-white transition hover:bg-royal/90"
                      >
                        ✏️ 글쓰기
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <p className="py-16 text-center text-navy-400">불러오는 중…</p>
                  ) : posts.length === 0 ? (
                    <p className="py-16 text-center text-navy-400">
                      아직 글이 없어요. 첫 글의 주인공이 되어보세요!
                    </p>
                  ) : (
                    <ul className="divide-y divide-navy-100 border-y border-navy-100 dark:divide-navy-700 dark:border-navy-700">
                      {posts.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => openPost(p.id)}
                            className="flex w-full items-center justify-between gap-4 px-2 py-4 text-left transition hover:bg-navy-50 dark:hover:bg-navy-800"
                          >
                            <span className="truncate font-bold text-navy-900 dark:text-white">
                              {p.title}
                            </span>
                            <span className="shrink-0 text-xs text-navy-400">
                              {p.author?.nickname} · {fmtDate(p.created_at)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {view === 'write' && (
                <WriteForm
                  tab={tab}
                  isAdmin={isAdmin}
                  userId={session.user.id}
                  onDone={() => { setView('list'); loadPosts(tab) }}
                  onCancel={() => setView('list')}
                  onErr={setErr}
                />
              )}

              {view === 'post' && current && (
                <PostView
                  post={current}
                  session={session}
                  isAdmin={isAdmin}
                  onBack={() => { setView('list'); loadPosts(tab) }}
                  onReload={() => openPost(current.id)}
                  onErr={setErr}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-royal dark:border-navy-600 dark:bg-navy-800 dark:text-white'

function WriteForm({ tab, isAdmin, userId, onDone, onCancel, onErr }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(tab)
  const [busy, setBusy] = useState(false)

  const writable = CATEGORIES.filter((c) => c.key !== 'notice' || isAdmin)

  async function submit() {
    if (!title.trim() || !content.trim() || busy) return
    setBusy(true)
    const { error } = await supabase.from('pf_posts').insert({
      author_id: userId,
      title: title.trim(),
      content: content.trim(),
      category,
    })
    setBusy(false)
    if (error) onErr(error.message)
    else onDone()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {writable.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-bold transition',
              category === c.key
                ? 'bg-royal text-white'
                : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-navy-200',
            ].join(' ')}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <input
        className={inputCls}
        placeholder="제목"
        value={title}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className={inputCls}
        placeholder="내용을 입력하세요"
        value={content}
        maxLength={5000}
        rows={10}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">취소</button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-royal px-5 py-2.5 text-sm font-bold text-white transition hover:bg-royal/90 disabled:opacity-40"
        >
          {busy ? '등록 중…' : '등록'}
        </button>
      </div>
    </div>
  )
}

function PostView({ post, session, isAdmin, onBack, onReload, onErr }) {
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const canDelete = session?.user?.id === post.author_id || isAdmin

  async function removePost() {
    if (!window.confirm('이 글을 삭제할까요?')) return
    const { error } = await supabase.from('pf_posts').delete().eq('id', post.id)
    if (error) onErr(error.message)
    else onBack()
  }

  async function addComment() {
    if (!comment.trim() || busy) return
    setBusy(true)
    const { error } = await supabase.from('pf_comments').insert({
      post_id: post.id,
      author_id: session.user.id,
      content: comment.trim(),
    })
    setBusy(false)
    if (error) onErr(error.message)
    else { setComment(''); onReload() }
  }

  async function removeComment(id) {
    const { error } = await supabase.from('pf_comments').delete().eq('id', id)
    if (error) onErr(error.message)
    else onReload()
  }

  return (
    <article>
      <button type="button" onClick={onBack} className="btn-ghost mb-5 text-sm">← 목록</button>

      <p className="font-pixel mb-2 text-xs text-royal dark:text-sky">
        {catLabel(post.category)}
      </p>
      <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">{post.title}</h2>
      <p className="mb-6 mt-2 border-b border-navy-100 pb-4 text-sm text-navy-400 dark:border-navy-700">
        {post.author?.nickname} · {fmtDate(post.created_at)}
        {canDelete && (
          <button
            type="button"
            onClick={removePost}
            className="ml-3 text-xs text-navy-400 underline hover:text-red-500"
          >
            삭제
          </button>
        )}
      </p>

      <div className="min-h-[120px] whitespace-pre-wrap leading-8 text-navy-800 dark:text-navy-100">
        {post.content}
      </div>

      <h3 className="mb-3 mt-10 font-bold text-navy-900 dark:text-white">
        댓글 {post.comments.length}
      </h3>
      <ul className="mb-5 divide-y divide-navy-100 dark:divide-navy-700">
        {post.comments.map((c) => (
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
      </ul>

      {session ? (
        <div className="flex gap-2">
          <input
            className={inputCls}
            placeholder="댓글 달기"
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
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
        <p className="text-sm text-navy-400">댓글을 쓰려면 로그인하세요.</p>
      )}
    </article>
  )
}
