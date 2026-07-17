import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TutorialDetail from './pages/TutorialDetail';

function App() {
  // Use the Vite base path dynamically so it works locally and on GitHub Pages
  const basePath = import.meta.env.BASE_URL;

  return (
    <Router basename={basePath}>
      <div className="app-container">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
        </Routes>
        
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto' }}>
          <p>© 2026 DevDocs. Built with Vite and React.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
