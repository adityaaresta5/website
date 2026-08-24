import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { ArrowLeft, Save, Plus } from 'lucide-react';

// BlockNote Imports
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from '../context/ThemeContext';

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.title = id ? 'Edit Tutorial | DevDocs' : 'New Tutorial | DevDocs';
  }, [id]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    tags: '',
    readTime: '5 min read',
    author: 'Admin',
  });
  
  const [initialContent, setInitialContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingCategories, setExistingCategories] = useState([]);
  
  const popularTags = ['React', 'Next.js', 'Docker', 'Kubernetes', 'Nginx', 'Node.js', 'Python', 'Go', 'Linux', 'Tailwind'];

  const handleUpload = async (file) => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error("File harus berupa gambar");
      }
      
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            // Compress image to max 1200x1200px
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 70% quality to keep Base64 size very small (usually <100KB)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
          };
          img.onerror = () => reject(new Error("Gagal membaca gambar"));
        };
        reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
      });
    } catch (error) {
      console.error("Gagal memproses gambar:", error);
      alert(`Gagal memproses gambar: ${error.message}`);
      throw error;
    }
  };

  // Initialize BlockNote Editor dengan fitur upload
  const editor = useCreateBlockNote({
    uploadFile: handleUpload,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Fetch all categories for datalist
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, 'tutorials'));
        const cats = new Set();
        snap.docs.forEach(doc => {
          if (doc.data().category) cats.add(doc.data().category);
        });
        setExistingCategories([...cats]);
      } catch (e) {
        console.error("Error fetching categories", e);
      }
    };
    fetchCategories();
    
    if (id) {
      const fetchDoc = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'tutorials', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              title: data.title || '',
              description: data.description || '',
              category: data.category || 'Web Development',
              tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
              readTime: data.readTime || '5 min read',
              author: data.author || 'Admin',
            });
            
            // Convert existing Markdown or HTML back to blocks
            if (data.content) {
              const blocks = data.content.trim().startsWith('<') 
                ? await editor.tryParseHTMLToBlocks(data.content)
                : await editor.tryParseMarkdownToBlocks(data.content);
              editor.replaceBlocks(editor.document, blocks);
            }
          }
        } catch (err) {
          console.error("Error fetching document:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDoc();
    } else {
      setLoading(false);
    }
  }, [id, editor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (status) => {
    setSaving(true);
    try {
      // Convert BlockNote blocks to HTML before saving
      const htmlContent = await editor.blocksToHTMLLossy(editor.document);
      
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const dataToSave = {
        ...formData,
        tags: tagsArray,
        status: status,
        userId: auth.currentUser ? auth.currentUser.uid : null,
        content: htmlContent,
        date: formData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        views: formData.views || '0',
        updatedAt: Date.now(),
        slug: generatedSlug
      };

      if (id) {
        await updateDoc(doc(db, 'tutorials', id), dataToSave);
        alert(`Artikel berhasil ${status === 'published' ? 'dipublish' : 'disimpan sebagai draft'}!`);
      } else {
        const docRef = await addDoc(collection(db, 'tutorials'), dataToSave);
        alert(`Artikel berhasil ${status === 'published' ? 'dipublish' : 'disimpan sebagai draft'}!`);
        navigate(`/admin/editor/${docRef.id}`, { replace: true });
      }
    } catch (err) {
      console.error("Error saving document:", err);
      alert("Gagal menyimpan tutorial.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="main-content" style={{textAlign: 'center', padding: '4rem'}}>Loading...</div>;

  return (
    <div className="main-content">
      <div className="content-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 2rem 0' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleSave('draft')} className="btn btn-secondary" disabled={saving}>
              {saving ? '...' : 'Simpan Draft'}
            </button>
            <button onClick={() => handleSave('published')} className="btn btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'Menyimpan...' : 'Publish'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          {/* Editor Utama */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan Judul Tutorial"
              style={{ fontSize: '2.5rem', fontWeight: 800, padding: '1rem', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
            
            <div 
              style={{ padding: '2rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', minHeight: '600px', boxShadow: 'var(--shadow-sm)' }}
              onKeyDown={(e) => {
                // Fix for Windows Ctrl+Alt+C (AltGr) issue
                if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
                  e.preventDefault();
                  try {
                    const { block } = editor.getTextCursorPosition();
                    if (block) {
                      editor.updateBlock(block, { type: "codeBlock" });
                    }
                  } catch (err) {
                    console.log("Could not update block", err);
                  }
                }
              }}
            >
              <BlockNoteView editor={editor} theme={isDarkMode ? "dark" : "light"} />
            </div>
          </div>

          {/* Sidebar Pengaturan */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', height: 'max-content', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Pengaturan</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Deskripsi Singkat</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Kategori (Ketik atau Pilih)</label>
              <input 
                type="text" 
                name="category"
                list="category-options"
                value={formData.category}
                onChange={handleChange}
                placeholder="Misal: Web Development"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
              <datalist id="category-options">
                {existingCategories.map((cat, i) => (
                  <option key={i} value={cat} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tags (Pisahkan dengan koma)</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Misal: React, Node.js"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
                      if (!currentTags.includes(tag)) {
                        setFormData({ ...formData, tags: [...currentTags, tag].join(', ') });
                      }
                    }}
                    style={{
                      background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                      padding: '4px 8px', borderRadius: '12px', fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Plus size={10} /> {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Waktu Baca</label>
              <input 
                type="text" 
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="Misal: 5 min read"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Penulis</label>
              <input 
                type="text" 
                name="author"
                value={formData.author}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
