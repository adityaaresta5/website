import React from 'react';
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import TutorialCard from '../components/TutorialCard';
import { tutorials } from '../data/tutorials';

const Home = () => {
  return (
    <main>
      <Hero />
      
      <div className="main-content">
        <Sidebar />
        
        <div className="content-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
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
            {tutorials.map(tutorial => (
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
  );
};

export default Home;
