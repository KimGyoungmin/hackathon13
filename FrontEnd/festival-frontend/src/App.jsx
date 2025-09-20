import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleMainPage from './pages/SimpleMainPage';
import './index.css';

/**
 * 메인 애플리케이션 컴포넌트
 * 라우팅과 전체 애플리케이션 구조를 관리합니다.
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SimpleMainPage />} />
          <Route path="*" element={<SimpleMainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
