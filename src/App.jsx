import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import TutorialCard from './components/TutorialCard';

const mockTutorials = [
  {
    id: 1,
    title: "How to Build a REST API with Node.js and Express",
    description: "Learn how to build a scalable and secure RESTful API from scratch using Node.js, Express, and MongoDB. Perfect for backend beginners.",
    category: "Backend & API",
    readTime: "12 min read",
    views: "15K",
    date: "Jul 15, 2026",
    author: "Alex Developer"
  },
  {
    id: 2,
    title: "Dockerizing a React Application for Production",
    description: "A step-by-step guide to creating Docker images for your React apps. Optimize your builds using multi-stage Dockerfiles and Nginx.",
    category: "DevOps & Cloud",
    readTime: "8 min read",
    views: "22K",
    date: "Jul 10, 2026",
    author: "Sarah Cloud"
  },
  {
    id: 3,
    title: "Understanding Server Actions in Next.js 14",
    description: "Dive deep into the new Server Actions paradigm. Learn how to mutate data securely without writing dedicated API routes.",
    category: "Web Development",
    readTime: "15 min read",
    views: "9.4K",
    date: "Jul 05, 2026",
    author: "Dan Frontend"
  },
  {
    id: 4,
    title: "Setting Up CI/CD Pipelines with GitHub Actions",
    description: "Automate your testing and deployment workflows. We'll build a pipeline that runs tests and deploys to AWS ECS on every push.",
    category: "DevOps & Cloud",
    readTime: "20 min read",
    views: "31K",
    date: "Jun 28, 2026",
    author: "DevOps Pro"
  },
  {
    id: 5,
    title: "Advanced PostgreSQL Indexing Strategies",
    description: "Speed up your slow queries by understanding how B-Tree, Hash, and GiST indexes work under the hood in PostgreSQL.",
    category: "Database",
    readTime: "18 min read",
    views: "11K",
    date: "Jun 15, 2026",
    author: "DBA Master"
  },
  {
    id: 6,
    title: "Implementing JWT Authentication in Go",
    description: "Secure your Go microservices using JSON Web Tokens. Learn about signing, verification, and handling token refresh.",
    category: "Cybersecurity",
    readTime: "14 min read",
    views: "8K",
    date: "Jun 02, 2026",
    author: "Security Ninja"
  }
];

function App() {
  return (
    <div className="app-container">
      <Header />
      
      <main>
        <Hero />
        
        <div className="main-content">
          <Sidebar />
          
          <div className="content-area">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Latest Tutorials</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', outline: 'none' }}>
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {mockTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} {...tutorial} />
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                Load More Tutorials
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 DevDocs. Built with Vite and React.</p>
      </footer>
    </div>
  );
}

export default App;
