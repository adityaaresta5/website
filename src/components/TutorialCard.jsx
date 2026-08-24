import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, MessageSquare, ChevronRight } from 'lucide-react';
import './TutorialCard.css';

const TutorialCard = ({ id, slug, title, description, category, readTime, views, date, author, tags, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="tutorial-card glass" 
      onClick={() => navigate(`/tutorial/${slug || id}`)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-header">
        <span className="card-category">{category}</span>
        <span className="card-date">{date}</span>
      </div>
      
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {tags.map((tag, i) => (
            <span key={i} style={{ 
              fontSize: '11px', 
              padding: '2px 8px', 
              background: 'var(--bg-main)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px',
              color: 'var(--text-secondary)'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="card-footer">
        <div className="card-author">
          <div className="author-avatar">{author.charAt(0)}</div>
          <span>{author}</span>
        </div>
        
        <div className="card-meta">
          <div className="meta-item">
            <Clock size={14} />
            <span>{readTime}</span>
          </div>
          <div className="meta-item">
            <Eye size={14} />
            <span>{views}</span>
          </div>
        </div>
      </div>
      
      <div className="card-hover-action">
        Read Tutorial <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default TutorialCard;
