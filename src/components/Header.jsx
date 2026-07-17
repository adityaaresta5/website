import React from 'react';
import { Search, Menu } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header glass">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>DevDocs</span>
        </div>

        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search documentation, tutorials, API..." />
          <div className="search-shortcut">Ctrl K</div>
        </div>

        <nav className="nav-links">
          <a href="#" className="active">Tutorials</a>
          <a href="#">API</a>
          <a href="#">Community</a>
        </nav>

        <div className="header-actions">
          <div className="divider"></div>
          <button className="btn btn-secondary">Sign In</button>
          <button className="btn btn-primary">Sign Up</button>
          <button className="menu-toggle"><Menu size={24} /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
