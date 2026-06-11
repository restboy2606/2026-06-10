import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

import Home from './pages/Home'
import News from './pages/News'
import Articles from './pages/Articles'
import ArticleView from './pages/ArticleView'
import About from './pages/About'
import Contact from './pages/Contact'
import Community from './pages/Community'
import SimplePage from './pages/SimplePage'

export default function App() {
  return (
    <AuthProvider>
    <div className="flex min-h-screen min-w-[320px] flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 웹진 — 신작 데스크(자동 수집) + 에디토리얼(직접 작성) */}
          <Route path="/news" element={<News />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleView />} />
          {/* 구 영상 강의 경로 → 신작 데스크로 */}
          <Route path="/videos/*" element={<Navigate to="/news" replace />} />

          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/terms"
            element={
              <SimplePage
                title="이용약관"
                body={[
                  '본 약관은 픽셀포지 프레스(이하 "회사")가 제공하는 게임 웹진 서비스의 이용 조건과 절차를 규정합니다.',
                  '회사가 직접 작성한 기사의 저작권은 회사에 있으며, 신작 데스크에 소개되는 게임의 썸네일·소개문의 저작권은 각 개발자에게 있습니다.',
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
