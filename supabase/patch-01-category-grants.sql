-- ────────────────────────────────────────────────────────────
-- 패치 01 — schema.sql 실행 후 한 번 실행
-- 1) 테이블 접근 권한(GRANT) 부여  ← "permission denied" 해결
-- 2) 게시판 카테고리 추가: notice(공지) / community(커뮤니티) / qna(학습 Q&A)
-- ────────────────────────────────────────────────────────────

-- 1) 권한 — 행 단위 차단은 RLS가 담당, 이건 그 아래층의 기본 출입 허가
grant usage on schema public to anon, authenticated;

grant select on public.pf_profiles, public.pf_posts, public.pf_comments
  to anon, authenticated;

grant insert, update, delete on public.pf_profiles, public.pf_posts, public.pf_comments
  to authenticated;

grant usage, select on all sequences in schema public to authenticated;

-- 2) 카테고리 컬럼 추가 (is_notice는 카테고리로 대체)
alter table public.pf_posts
  add column category text not null default 'community'
  check (category in ('notice', 'community', 'qna'));

-- 기존 is_notice 데이터 이관 후 컬럼 제거
update public.pf_posts set category = 'notice' where is_notice;

drop policy "posts: 로그인 사용자만 작성" on public.pf_posts;

alter table public.pf_posts drop column is_notice;

-- 작성 정책 재생성: 공지(notice)는 admin만, 나머지는 로그인 사용자 누구나
create policy "posts: 로그인 사용자만 작성" on public.pf_posts
  for insert with check (
    auth.uid() = author_id
    and (category <> 'notice' or public.pf_is_admin())
  );
