import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TutorialDetail from './pages/TutorialDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditor from './pages/AdminEditor';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import StarryBackground from './components/StarryBackground';

function ScrollRevealWrapper() {
  useScrollReveal();
  
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.body.style.setProperty('--scroll-y', `${window.scrollY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Call once to set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}

function App() {
  const basePath = import.meta.env.BASE_URL;

  return (
    <ThemeProvider>
      <Router>
        <StarryBackground />
        <ScrollRevealWrapper />
        <div className="app-container">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorial/:id" element={<TutorialDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/editor" element={<AdminEditor />} />
            <Route path="/admin/editor/:id" element={<AdminEditor />} />
          </Routes>
          
          <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto' }}>
            <p>© 2026 DevDocs. Built with Vite and React.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
