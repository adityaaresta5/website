import React from 'react';
import { BookOpen, Code, Server, Shield, Database, Layout, Terminal } from 'lucide-react';
import './Sidebar.css';

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('web')) return <Layout size={18} />;
  if (lower.includes('api') || lower.includes('backend')) return <Code size={18} />;
  if (lower.includes('cloud') || lower.includes('devops')) return <Server size={18} />;
  if (lower.includes('data')) return <Database size={18} />;
  if (lower.includes('cyber') || lower.includes('security')) return <Shield size={18} />;
  if (lower.includes('linux') || lower.includes('system')) return <Terminal size={18} />;
  return <BookOpen size={18} />;
};

const popularTags = ['React', 'Next.js', 'Docker', 'Kubernetes', 'Nginx', 'Node.js', 'Python', 'Go'];

const Sidebar = ({ categories = [], currentCategory, currentTag, onSelectCategory, onSelectTag }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <button 
                className={`category-btn ${currentCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-section mt-4">
        <h3 className="sidebar-title">Popular Tags</h3>
        <div className="tag-cloud">
          {popularTags.map((tag, idx) => (
            <button 
              key={idx} 
              className={`tag ${currentTag === tag ? 'active-tag' : ''}`}
              onClick={() => onSelectTag(tag)}
              style={{
                background: currentTag === tag ? 'var(--accent-primary)' : 'transparent',
                color: currentTag === tag ? 'white' : 'var(--text-secondary)',
                border: currentTag === tag ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
