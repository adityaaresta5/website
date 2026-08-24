import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import TutorialCard from '../components/TutorialCard';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams, useLocation } from 'react-router-dom';

const Home = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    document.title = 'DevDocs - Documentation & Tutorials';
  }, []);

  const currentCategory = searchParams.get('category') || 'All Topics';
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('q') || '';

  useEffect(() => {
    const q = query(
      collection(db, 'tutorials'),
      where('status', '==', 'published')
    ); 
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tuts = [];
      querySnapshot.forEach((doc) => {
        tuts.push({ id: doc.id, ...doc.data() });
      });
      // Sort by newest updatedAt or parse the string date as fallback
      tuts.sort((a, b) => {
        const timeA = a.updatedAt || Date.parse(a.date) || 0;
        const timeB = b.updatedAt || Date.parse(b.date) || 0;
        return timeB - timeA;
      });
      setTutorials(tuts);
      setLoading(false);
    }, (err) => {
      console.error("Gagal mengambil tutorial:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter tutorials based on URL parameters
  const filteredTutorials = tutorials.filter(tut => {
    const matchCategory = currentCategory === 'All Topics' || tut.category === currentCategory;
    
    // Tag matching: check if tag is in title or description or category
    const searchTag = currentTag.toLowerCase();
    const matchTag = currentTag === '' || 
      (tut.title?.toLowerCase().includes(searchTag)) || 
      (tut.description?.toLowerCase().includes(searchTag)) ||
      (tut.category?.toLowerCase().includes(searchTag));
      
    // Search matching
    const searchQ = currentSearch.toLowerCase();
    const matchSearch = currentSearch === '' ||
      (tut.title?.toLowerCase().includes(searchQ)) ||
      (tut.description?.toLowerCase().includes(searchQ)) ||
      (tut.content?.toLowerCase().includes(searchQ));
      
    return matchCategory && matchTag && matchSearch;
  });

  const visibleTutorials = filteredTutorials.slice(0, visibleCount);

  // Extract dynamic categories from all tutorials
  const dynamicCategories = ['All Topics', ...new Set(tutorials.map(t => t.category).filter(Boolean))];

  return (
    <main>
      <Hero />
      
      <div className="main-content">
        <Sidebar 
          categories={dynamicCategories} 
          currentCategory={currentCategory}
          currentTag={currentTag}
          onSelectCategory={(cat) => {
            if (cat === 'All Topics') searchParams.delete('category');
            else searchParams.set('category', cat);
            setSearchParams(searchParams);
          }}
          onSelectTag={(tag) => {
            if (tag === currentTag) searchParams.delete('tag'); // toggle off
            else searchParams.set('tag', tag);
            setSearchParams(searchParams);
          }}
        />
        
        <div className="content-area" id="tutorials">
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading tutorials...</div>
          ) : filteredTutorials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Belum ada tutorial yang sesuai dengan kriteria.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {visibleTutorials.map((tutorial, index) => (
                <TutorialCard key={tutorial.id} {...tutorial} index={index} />
              ))}
            </div>
          )}
          
          {filteredTutorials.length > visibleCount && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.75rem 2rem' }}
                onClick={() => setVisibleCount(prev => prev + 4)}
              >
                Load More Tutorials
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
