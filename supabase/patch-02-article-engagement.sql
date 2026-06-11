-- ────────────────────────────────────────────────────────────
-- 패치 02 — 기사 반응 + 회원 전용 댓글 (PIXELFORGE PRESS)
-- article_id 는 텍스트 키 (예: 'editorial:devlog-guild-board-in-a-day')
-- ────────────────────────────────────────────────────────────

-- 기사 댓글
create table public.pf_article_comments (
  id bigint generated always as identity primary key,
  article_id text not null,
  author_id uuid not null references public.pf_profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index pf_article_comments_article_idx on public.pf_article_comments (article_id);

-- 기사 반응 (회원당 기사·종류별 1개 — 토글)
create table public.pf_article_reactions (
  id bigint generated always as identity primary key,
  article_id text not null,
  user_id uuid not null references public.pf_profiles(id) on delete cascade,
  kind text not null check (kind in ('like', 'fire', 'retro')),
  created_at timestamptz not null default now(),
  unique (article_id, user_id, kind)
);
create index pf_article_reactions_article_idx on public.pf_article_reactions (article_id);

-- RLS
alter table public.pf_article_comments  enable row level security;
alter table public.pf_article_reactions enable row level security;

create policy "article comments: 누구나 조회" on public.pf_article_comments
  for select using (true);
create policy "article comments: 회원만 작성" on public.pf_article_comments
  for insert with check (auth.uid() = author_id);
create policy "article comments: 본인 또는 admin 삭제" on public.pf_article_comments
  for delete using (auth.uid() = author_id or public.pf_is_admin());

create policy "article reactions: 누구나 조회" on public.pf_article_reactions
  for select using (true);
create policy "article reactions: 회원만 추가" on public.pf_article_reactions
  for insert with check (auth.uid() = user_id);
create policy "article reactions: 본인 것만 취소" on public.pf_article_reactions
  for delete using (auth.uid() = user_id);

-- 권한 (행 단위 차단은 위 RLS가 담당)
grant select on public.pf_article_comments, public.pf_article_reactions
  to anon, authenticated;
grant insert, delete on public.pf_article_comments, public.pf_article_reactions
  to authenticated;
grant usage, select on all sequences in schema public to authenticated;
