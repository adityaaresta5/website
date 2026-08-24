import React from 'react';
import { ArrowRight, Code } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge reveal reveal-delay-1">
          <span className="badge-pill">New</span>
          <p>React 19 tutorials are now available</p>
          <ArrowRight size={14} />
        </div>
        
        <h1 className="hero-title reveal reveal-delay-2">
          MAKE IT ONCE. <br />
          <span className="cursive-accent">real</span> DOCUMENTATION
        </h1>
        
        <p className="hero-description reveal reveal-delay-3">
          Explore our comprehensive IT tutorials and documentation. 
          Learn best practices for web development, cloud infrastructure, and software engineering.
        </p>
        
        <div className="hero-actions reveal reveal-delay-3">
          <a href="#tutorials" className="btn btn-primary btn-lg" style={{textDecoration: 'none'}}>
            Start Learning <ArrowRight size={18} />
          </a>
          <a href="https://github.com/adityaaresta5" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg" style={{textDecoration: 'none'}}>
            <Code size={18} /> View GitHub
          </a>
        </div>
      </div>
      
      <div className="hero-visual reveal-zoom">
        <div className="lottie-container">
          <Player
            autoplay
            loop
            src="https://lottie.host/a7217315-e2d9-4824-a745-f37bf1c360da/2n4b9v6xRk.json"
            style={{ height: '350px', width: '350px', opacity: 0.8 }}
            fallback={
              <Player
                autoplay
                loop
                src="https://assets2.lottiefiles.com/packages/lf20_ky20630m.json"
                style={{ height: '350px', width: '350px', opacity: 0.8 }}
              />
            }
          />
        </div>

        <div className="code-window">
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
