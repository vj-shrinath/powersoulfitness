'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ContentItem = {
  value: string;
  type: string;
};

export default function AdminDashboard() {
  const [contents, setContents] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('text');
  const router = useRouter();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const res = await fetch('/api/content');
    if (res.ok) {
      const { data } = await res.json();
      setContents(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleUpdate = async (key: string, value: string, type: string) => {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, type })
    });
    if (res.ok) {
      alert(`Updated ${key} successfully!`);
      fetchContents();
    } else {
      alert('Failed to update content');
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    
    await handleUpdate(newKey, newValue, newType);
    setNewKey('');
    setNewValue('');
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div>
      <header className="admin-header">
        <h1>Power Soul Fitness - Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-content">
        <div className="add-new-section">
          <h3>Add New Dynamic Content</h3>
          <form onSubmit={handleAddNew} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Content Key (e.g. home_about_text)" 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="content-input"
              style={{ marginBottom: 0, flex: 1 }}
              required
            />
            <select 
              value={newType} 
              onChange={(e) => setNewType(e.target.value)}
              className="content-input"
              style={{ marginBottom: 0, width: 'auto' }}
            >
              <option value="text">Text / HTML</option>
              <option value="image">Image URL</option>
            </select>
            <input 
              type="text" 
              placeholder="Value" 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="content-input"
              style={{ marginBottom: 0, flex: 2 }}
              required
            />
            <button type="submit" className="save-btn">Add</button>
          </form>
        </div>

        <h2>Manage Existing Content</h2>
        {Object.entries(contents).map(([key, item]) => (
          <div key={key} className="content-item">
            <h3>{key} <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>({item.type})</span></h3>
            {item.type === 'image' ? (
              <>
                <img src={item.value} alt={key} style={{ maxHeight: '100px', display: 'block', marginBottom: '1rem' }} />
                <input 
                  type="text" 
                  value={item.value}
                  onChange={(e) => setContents({...contents, [key]: { ...item, value: e.target.value }})}
                  className="content-input"
                />
              </>
            ) : (
              <textarea 
                value={item.value}
                onChange={(e) => setContents({...contents, [key]: { ...item, value: e.target.value }})}
                className="content-input"
              />
            )}
            <button 
              className="save-btn"
              onClick={() => handleUpdate(key, item.value, item.type)}
            >
              Save Changes
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
