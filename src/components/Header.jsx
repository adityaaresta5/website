import React, { useState } from 'react';
import { Search, Menu, Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { User } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const currentCategory = searchParams.get('category');
      const currentTag = searchParams.get('tag');
      
      let url = '/?';
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (currentCategory) params.set('category', currentCategory);
      if (currentTag) params.set('tag', currentTag);
      
      navigate(`/${params.toString() ? '?' + params.toString() : ''}`);
    }
  };

  return (
    <header className="header glass">
      <div className="header-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}>
            <Code2 size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>DevDocs</span>
        </Link>

        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search documentation, tutorials, API..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <div className="search-shortcut">Enter</div>
        </div>

        <nav className="nav-links">
          <Link to="/" className="active">Tutorials</Link>
          <Link to="/">API</Link>
          <Link to="/">Community</Link>
        </nav>

        <div className="header-actions">
          <button 
            onClick={toggleTheme} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="divider"></div>
          {user ? (
            <Link to="/admin" className="btn btn-secondary" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize'}}>
              <User size={16} /> {user.email ? user.email.split('@')[0] : 'Admin'}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{textDecoration: 'none'}}>Sign In</Link>
          )}
          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="search-bar mobile-search">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === 'Enter') setIsMobileMenuOpen(false);
              }}
            />
          </div>
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Tutorials</Link>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
            {user ? (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize'}}>
                <User size={16} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
