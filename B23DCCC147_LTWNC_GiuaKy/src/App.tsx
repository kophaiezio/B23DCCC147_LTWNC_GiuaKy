import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { Home } from './pages/Home';

// YÊU CẦU: Trang Thống kê (/stats) phải được Lazy load bằng React.lazy
const Stats = lazy(() => import('./pages/Stats'));

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Header với Navigation & Nút đổi Theme */}
        <header className="app-header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="brand-icon">📚</span>
              <span className="brand-name">Mini Library</span>
            </div>

            <nav className="header-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
                end
              >
                Trang chủ
              </NavLink>
              <NavLink
                to="/stats"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                Thống kê
              </NavLink>
            </nav>

            <div className="header-actions">
              <button
                className="btn btn-theme-toggle"
                onClick={toggleTheme}
                aria-label="Chuyển đổi giao diện sáng tối"
              >
                {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="app-main">
          {/* YÊU CẦU: Bọc Suspense cho Lazy Load */}
          <Suspense
            fallback={
              <div className="loading-state">
                <p>Đang tải trang...</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;

