import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Clock, Eye, Calendar, User } from 'lucide-react';
import { getTutorialById } from '../data/tutorials';
import './TutorialDetail.css';

const TutorialDetail = () => {
  const { id } = useParams();
  const tutorial = getTutorialById(id);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Determine the base path dynamically to handle local dev vs github pages
  const basePath = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    if (tutorial) {
      setLoading(true);
      fetch(`${basePath}tutorials/${tutorial.file}`)
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.text();
        })
        .then((text) => setContent(text))
        .catch((err) => {
          console.error('Failed to load markdown file:', err);
          setContent('# Error\nFailed to load the tutorial content. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, tutorial, basePath]);

  if (!tutorial) {
    return (
      <div className="main-content">
        <div className="content-area" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Tutorial Not Found</h2>
          <Link to="/" className="btn btn-secondary mt-4">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="main-content tutorial-detail-page">
      <div className="content-area detail-container">
        
        <div className="detail-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Tutorials
          </Link>
          
          <div className="detail-meta">
            <span className="badge">{tutorial.category}</span>
            <div className="meta-info">
              <span><Calendar size={14} /> {tutorial.date}</span>
              <span><Clock size={14} /> {tutorial.readTime}</span>
              <span><Eye size={14} /> {tutorial.views}</span>
            </div>
          </div>
          
          <h1 className="detail-title">{tutorial.title}</h1>
          <p className="detail-description">{tutorial.description}</p>
          
          <div className="author-box glass">
            <div className="author-avatar-lg">{tutorial.author.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tutorial.author}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Staff Writer</div>
            </div>
          </div>
        </div>

        <div className="markdown-content">
          {loading ? (
            <div className="loading-state">Loading tutorial content...</div>
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={vscDarkPlus}
                      className="code-block"
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </Markdown>
          )}
        </div>
        
      </div>
    </main>
  );
};

export default TutorialDetail;
