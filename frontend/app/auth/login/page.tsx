'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (email === 'vedeekaparab9999@gmail.com' && password === 'password123') {
      try {
        const apiUrl = `http://127.0.0.1:8000/profile?linkedin_url=${encodeURIComponent(
          linkedinUrl
        )}`;

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || `Server Error: ${res.status}`);
        }

        const profileData = await res.json();
        console.log('Success:', profileData);

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('linkedinUrl', linkedinUrl);

        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid email or password');
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
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">LinkedIn URL</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
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
