'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111', color: 'white' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#222', padding: '2rem', borderRadius: '10px', width: '300px' }}>
        <h2 style={{ textAlign: 'center', margin: 0, marginBottom: '1rem' }}>Admin Login</h2>
        {error && <p style={{ color: '#ff4444', textAlign: 'center' }}>{error}</p>}
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white' }}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white' }}
          required
        />
        <button type="submit" style={{ padding: '0.8rem', borderRadius: '5px', border: 'none', background: '#ff3333', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
          Login
        </button>
      </form>
    </div>
  );
}
