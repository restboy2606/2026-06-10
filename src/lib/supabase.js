import { createClient } from '@supabase/supabase-js'

// anon public key는 공개돼도 안전 (RLS가 DB 계층에서 방어)
// ⚠️ service_role 키는 절대 여기 넣지 말 것 — RLS를 무시하는 만능키
const SUPABASE_URL = 'https://ndstbqbbgykfkjyqklpc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kc3RicWJiZ3lrZmtqeXFrbHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjYxMjIsImV4cCI6MjA5NjY0MjEyMn0.KZq-sEcVei3gGYxtcTcPXd4syYfwVazRV99e48BBdbU'

export const isConfigured = !SUPABASE_ANON_KEY.startsWith('PASTE_')

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
