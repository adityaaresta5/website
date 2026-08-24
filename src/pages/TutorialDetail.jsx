import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Clock, Eye, Calendar, Check, Copy, Download } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import parse, { domToReact } from 'html-react-parser';
import './TutorialDetail.css';

const CodeBlockWithCopy = ({ children, language, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mac-window reveal">
      <div className="mac-header">
        <div style={{display: 'flex', gap: '8px'}}>
          <div className="mac-btn close"></div>
          <div className="mac-btn minimize"></div>
          <div className="mac-btn maximize"></div>
        </div>
        <button 
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px'
          }}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        language={language}
        style={isDarkMode ? vscDarkPlus : vs}
        className="code-block"
        customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: isDarkMode ? 'var(--bg-main)' : 'var(--bg-main)' }}
      />
    </div>
  );
};

const CustomZoomContent = ({ buttonUnzoom, img }) => {
  const handleDownload = async (e) => {
    e.stopPropagation();
    const src = img?.props?.src;
    if (!src) return;
    
    let filename = 'download';
    if (src.startsWith('data:image/')) {
      const ext = src.split(';')[0].split('/')[1] || 'png';
      filename = `image_${Date.now()}.${ext}`;
    } else {
      filename = src.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
    }

    try {
      let res;
      try {
        res = await fetch(src);
        if (!res.ok) throw new Error("Network response was not ok");
      } catch (fetchErr) {
        const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(src)}`;
        res = await fetch(proxyUrl);
      }
      
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error("Tipe file yang diterima bukan gambar");
      }
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error("Gagal mendownload gambar:", err);
      alert("Maaf, gambar dari website ini dilindungi dan tidak bisa di-download secara langsung.");
    }
  };

  return (
    <>
      {buttonUnzoom}
      {img}
      <button 
        onClick={handleDownload}
        style={{
          position: 'fixed',
          top: '15px',
          right: '80px',
          zIndex: 2147483647,
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
        title="Download Gambar"
      >
        <Download size={20} />
      </button>
    </>
  );
};


const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = null;
    
    const resolveAndListen = async () => {
      try {
        let docRef = doc(db, 'tutorials', id);
        let docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const q = query(collection(db, 'tutorials'), where('slug', '==', id));
          const querySnap = await getDocs(q);
          
          if (!querySnap.empty) {
            docRef = doc(db, 'tutorials', querySnap.docs[0].id);
          } else {
            setTutorial(null);
            setLoading(false);
            return;
          }
        }
        
        unsubscribe = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (id === snap.id && data.slug) {
              navigate(`/tutorial/${data.slug}`, { replace: true });
              return;
            }
            setTutorial({ id: snap.id, ...data });
          } else {
            setTutorial(null);
          }
          setLoading(false);
        }, (err) => {
          console.error('Snapshot error:', err);
          setLoading(false);
        });
      } catch (err) {
        console.error('Failed to resolve tutorial:', err);
        setLoading(false);
      }
    };
    
    resolveAndListen();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (tutorial) {
      document.title = `${tutorial.title} | DevDocs`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && tutorial.description) {
        metaDesc.setAttribute('content', tutorial.description);
      }
      
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && tutorial.category) {
        metaKeywords.setAttribute('content', `${tutorial.category}, tutorial, belajar coding, pemrograman`);
      }
    }
  }, [tutorial]);

  if (loading || authLoading) {
    return <div className="main-content" style={{textAlign: 'center', padding: '5rem 0'}}>Loading tutorial...</div>;
  }

  const isOwner = user && tutorial && tutorial.userId === user.uid;
  if (!tutorial || (tutorial.status === 'draft' && !isOwner)) {
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
        
        <div className="detail-header reveal">
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
          
          <div className="author-box">
            <div className="author-avatar-lg">{tutorial.author ? tutorial.author.charAt(0) : 'A'}</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tutorial.author}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Staff Writer</div>
            </div>
          </div>
        </div>

        <div className="markdown-content reveal reveal-delay-2">
          {tutorial.content?.trim().startsWith('<') ? (
            parse(tutorial.content, {
              replace: (domNode) => {
                if (domNode.name === 'img') {
                  const props = domNode.attribs || {};
                  return (
                    <Zoom ZoomContent={CustomZoomContent}>
                      <img 
                        {...props} 
                        style={{ 
                          borderRadius: 'var(--radius-images)', 
                          maxWidth: '100%',
                          height: 'auto',
                          ...props.style,
                          width: props.width ? `${props.width}px` : (props.style?.width || 'auto')
                        }} 
                      />
                    </Zoom>
                  );
                }
                if (domNode.name === 'pre' && domNode.children && domNode.children.length > 0) {
                  const codeNode = domNode.children.find(c => c.name === 'code') || domNode;
                  const language = domNode.attribs?.['data-language'] || 'javascript';
                  
                  let codeText = '';
                  const extractText = (node) => {
                    if (node.type === 'text') codeText += node.data;
                    if (node.children) node.children.forEach(extractText);
                  };
                  extractText(codeNode);
                  
                  return <CodeBlockWithCopy language={language} isDarkMode={isDarkMode}>{codeText}</CodeBlockWithCopy>;
                }
              }
            })
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <CodeBlockWithCopy language={match[1]} isDarkMode={isDarkMode}>
                      {children}
                    </CodeBlockWithCopy>
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                },
                img(props) {
                  return (
                    <Zoom ZoomContent={CustomZoomContent}>
                      <img 
                        {...props} 
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto', 
                          borderRadius: 'var(--radius-images)', 
                          ...props.style
                        }} 
                      />
                    </Zoom>
                  );
                }
              }}
            >
              {tutorial.content || '# Tidak ada konten'}
            </Markdown>
          )}
        </div>
        
      </div>
    </main>
  );
};

export default TutorialDetail;
