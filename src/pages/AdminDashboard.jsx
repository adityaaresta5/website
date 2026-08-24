import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Plus, Edit, Trash2, LogOut, Eye, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Dashboard | DevDocs';
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        fetchTutorials();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchTutorials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tutorials'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Auto-migrate older articles that don't have status or userId
      let needsRefresh = false;
      for (let tut of data) {
        if (!tut.status || !tut.userId) {
          await updateDoc(doc(db, 'tutorials', tut.id), {
            status: tut.status || 'published',
            userId: tut.userId || auth.currentUser.uid
          });
          needsRefresh = true;
        }
      }

      if (needsRefresh) {
        // Refetch after migration to get the updated data
        const updatedSnapshot = await getDocs(collection(db, 'tutorials'));
        const updatedData = updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const visibleData = updatedData.filter(tut => {
          if (tut.status !== 'draft') return true;
          return auth.currentUser && tut.userId === auth.currentUser.uid;
        });
        setTutorials(visibleData);
      } else {
        // Filter: Show all published, but only show drafts if userId matches current user
        const visibleData = data.filter(tut => {
          if (tut.status !== 'draft') return true;
          return auth.currentUser && tut.userId === auth.currentUser.uid;
        });
        setTutorials(visibleData);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tutorial ini?")) {
      try {
        await deleteDoc(doc(db, 'tutorials', id));
        fetchTutorials();
      } catch (err) {
        console.error("Gagal menghapus:", err);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  if (loading) return <div className="main-content"><div className="content-area" style={{textAlign: 'center', padding: '4rem'}}>Loading...</div></div>;

  return (
    <div className="main-content">
      <div className="content-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Admin Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cari artikel..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: '250px'
                }}
              />
            </div>
            <Link to="/admin/editor" className="btn btn-primary">
              <Plus size={18} /> Tulis Tutorial Baru
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Judul</th>
                <th style={{ padding: '1rem' }}>Kategori</th>
                <th style={{ padding: '1rem' }}>Tanggal</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tutorials.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{searchQuery ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada tutorial. Klik \"Tulis Tutorial Baru\" untuk mulai."}</td></tr>
              ) : (
                tutorials
                  .filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(tut => (
                  <tr key={tut.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      {tut.title}
                      {tut.status === 'draft' && (
                        <span style={{ marginLeft: '8px', fontSize: '10px', padding: '2px 6px', background: '#374151', color: '#9ca3af', borderRadius: '4px', textTransform: 'uppercase' }}>Draft</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{tut.category}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{tut.date}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link to={`/tutorial/${tut.slug || tut.id}`} target="_blank" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} title="Lihat Tutorial">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/admin/editor/${tut.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} title="Edit Tutorial">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(tut.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Hapus Tutorial">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
