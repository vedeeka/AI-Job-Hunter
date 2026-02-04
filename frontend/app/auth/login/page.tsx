'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !number || !password || !linkedinUrl) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    // Demo auth
    if (email !== 'vedeekaparab9999@gmail.com' || password !== 'password123') {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/profile?linkedin_url=${encodeURIComponent(
          linkedinUrl
        )}`,
        { headers: { Accept: 'application/json' } }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server error ${res.status}`);
      }

      const profileData = await res.json();

      /* 🔥 STORE EVERYTHING */
      localStorage.setItem('loggedIn', 'true');

      // User entered data
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_phone', number);
      localStorage.setItem('user_linkedin_input', linkedinUrl);

      // Backend extracted data
      localStorage.setItem('profile_name', profileData.name ?? '');
      localStorage.setItem('profile_email', profileData.email ?? '');
      localStorage.setItem('profile_phone', profileData.phone ?? '');
      localStorage.setItem('profile_linkedin', profileData.linkedin ?? '');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">LinkedIn URL</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
