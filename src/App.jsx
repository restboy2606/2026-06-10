import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

import Home from './pages/Home'
import Videos from './pages/Videos'
import About from './pages/About'
import Contact from './pages/Contact'
import Community from './pages/Community'
import SimplePage from './pages/SimplePage'
import { topics } from './data/site'

export default function App() {
  return (
    <AuthProvider>
    <div className="flex min-h-screen min-w-[320px] flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 영상 강의 — :topic 으로 주제 전환 */}
          <Route path="/videos" element={<Navigate to={`/videos/${topics[0].key}`} replace />} />
          <Route path="/videos/:topic" element={<Videos />} />

          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/terms"
            element={
              <SimplePage
                title="이용약관"
                body={[
                  '본 약관은 픽셀포지 아카데미(이하 "회사")가 제공하는 온라인 동영상 교육 서비스의 이용 조건과 절차를 규정합니다.',
                  '회사가 제공하는 모든 동영상 콘텐츠의 저작권은 회사 또는 정당한 권리자에게 있으며, 무단 복제·배포·전송을 금합니다.',
                ]}
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <SimplePage
                title="개인정보처리방침"
                body={[
                  '회사는 이용자의 개인정보를 중요시하며, 관련 법령을 준수합니다.',
                  '수집한 개인정보는 문의 응대 및 서비스 제공 목적 외에는 사용하지 않습니다.',
                ]}
              />
            }
          />

          <Route path="*" element={<SimplePage title="페이지를 찾을 수 없습니다" />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
    </AuthProvider>
  )
}
