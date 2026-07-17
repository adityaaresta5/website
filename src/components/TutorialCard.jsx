import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, MessageSquare, ChevronRight } from 'lucide-react';
import './TutorialCard.css';

const TutorialCard = ({ id, title, description, category, readTime, views, date, author }) => {
  const navigate = useNavigate();

  return (
    <div className="tutorial-card glass" onClick={() => navigate(`/tutorial/${id}`)}>
      <div className="card-header">
        <span className="card-category">{category}</span>
        <span className="card-date">{date}</span>
      </div>
      
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      
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
