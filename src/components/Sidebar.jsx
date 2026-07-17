import React from 'react';
import { BookOpen, Code, Server, Shield, Database, Layout } from 'lucide-react';
import './Sidebar.css';

const categories = [
  { name: 'All Topics', icon: <BookOpen size={18} />, active: true },
  { name: 'Web Development', icon: <Layout size={18} /> },
  { name: 'Backend & API', icon: <Code size={18} /> },
  { name: 'DevOps & Cloud', icon: <Server size={18} /> },
  { name: 'Database', icon: <Database size={18} /> },
  { name: 'Cybersecurity', icon: <Shield size={18} /> },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <button className={`category-btn ${cat.active ? 'active' : ''}`}>
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-section mt-4">
        <h3 className="sidebar-title">Popular Tags</h3>
        <div className="tag-cloud">
          {['React', 'Next.js', 'Docker', 'Kubernetes', 'Nginx', 'Node.js', 'Python', 'Go'].map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
