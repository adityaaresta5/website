import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span>New</span>
          <p>React 19 tutorials are now available</p>
          <ArrowRight size={14} />
        </div>
        
        <h1 className="hero-title">
          Build faster with <br />
          <span className="text-gradient">modern documentation</span>
        </h1>
        
        <p className="hero-description">
          Explore our comprehensive IT tutorials and documentation. 
          Learn best practices for web development, cloud infrastructure, and software engineering.
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg">
            Start Learning <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg">
            <Terminal size={18} /> Browse API
          </button>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="glow-orb"></div>
        <div className="code-window glass">
          <div className="window-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <pre className="code-content">
            <code>
<span className="keyword">import</span> {'{'} Server {'}'} <span className="keyword">from</span> <span className="string">'@devdocs/core'</span>;{'\n\n'}
<span className="keyword">const</span> app = <span className="keyword">new</span> Server();{'\n\n'}
app.deploy(<span className="string">'/production'</span>).<span className="function">then</span>((res) =&gt; {'{\n'}
  console.<span className="function">log</span>(<span className="string">'🚀 App is live!'</span>);{'\n'}
{'}'});
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default Hero;
