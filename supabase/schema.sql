-- ────────────────────────────────────────────────────────────
-- PIXELFORGE STUDIOS — 커뮤니티 게시판 스키마
-- Supabase SQL Editor에 전체 붙여넣기 → Run 한 번이면 끝.
-- 테이블: pf_profiles(프로필) / pf_posts(게시글) / pf_comments(댓글)
-- 보안: 전부 RLS로 DB 계층에서 차단 (서버 없는 구조의 핵심 방어선)
-- ────────────────────────────────────────────────────────────

-- 1) 프로필 — auth.users와 1:1, 가입 시 트리거로 자동 생성
create table public.pf_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '픽셀 단조공',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- 가입 트리거: 카카오 프로필에서 닉네임/아바타 가져와 자동 입력
create or replace function public.pf_handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.pf_profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'preferred_username',
      '픽셀 단조공'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger pf_on_auth_user_created
  after insert on auth.users
  for each row execute function public.pf_handle_new_user();

-- 2) 게시글
create table public.pf_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.pf_profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 5000),
  is_notice boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3) 댓글
create table public.pf_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.pf_posts(id) on delete cascade,
  author_id uuid not null references public.pf_profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

-- 관리자 판별 헬퍼 (RLS 정책에서 재사용)
create or replace function public.pf_is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.pf_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- RLS — 모든 비즈니스 규칙은 여기서 강제됨
-- ────────────────────────────────────────────────────────────
alter table public.pf_profiles enable row level security;
alter table public.pf_posts    enable row level security;
alter table public.pf_comments enable row level security;

-- 프로필: 누구나 조회(닉네임 표시용), 본인만 수정 (role은 admin만 변경)
create policy "profiles: 누구나 조회" on public.pf_profiles
  for select using (true);

create policy "profiles: 본인만 수정" on public.pf_profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (role = (select role from public.pf_profiles where id = auth.uid()) or public.pf_is_admin())
  );

-- 게시글: 누구나 읽기 / 로그인해야 작성 / 공지는 admin만 / 수정·삭제는 본인 또는 admin
create policy "posts: 누구나 조회" on public.pf_posts
  for select using (true);

create policy "posts: 로그인 사용자만 작성" on public.pf_posts
  for insert with check (
    auth.uid() = author_id
    and (not is_notice or public.pf_is_admin())
  );

create policy "posts: 본인 또는 admin 수정" on public.pf_posts
  for update using (auth.uid() = author_id or public.pf_is_admin())
  with check (auth.uid() = author_id or public.pf_is_admin());

create policy "posts: 본인 또는 admin 삭제" on public.pf_posts
  for delete using (auth.uid() = author_id or public.pf_is_admin());

-- 댓글: 누구나 읽기 / 로그인해야 작성 / 삭제는 본인 또는 admin
create policy "comments: 누구나 조회" on public.pf_comments
  for select using (true);

create policy "comments: 로그인 사용자만 작성" on public.pf_comments
  for insert with check (auth.uid() = author_id);

create policy "comments: 본인 또는 admin 삭제" on public.pf_comments
  for delete using (auth.uid() = author_id or public.pf_is_admin());

-- ────────────────────────────────────────────────────────────
-- 실행 후 할 일:
-- 1. 카카오 로그인으로 사이트에서 1번 가입
-- 2. Table Editor → pf_profiles → 내 row의 role을 'admin'으로 변경
-- ────────────────────────────────────────────────────────────
