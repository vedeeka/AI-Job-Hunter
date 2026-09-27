'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Linkedin, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { getApiUrl } from '../../utils/api';

export default function LoginPage() {
  const [name, setName] = useState('Vedeeka Parab');
  const [email, setEmail] = useState('vedeekaparab9999@gmail.com');
  const [number, setNumber] = useState('+91 9876543210');
  const [password, setPassword] = useState('password123');
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/vedeeka-parab-7a5174270');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFillDemo = () => {
    setName('Vedeeka Parab');
    setEmail('vedeekaparab9999@gmail.com');
    setNumber('+91 9876543210');
    setPassword('password123');
    setLinkedinUrl('https://www.linkedin.com/in/vedeeka-parab-7a5174270');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in your name, email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        getApiUrl(`/profile?linkedin_url=${encodeURIComponent(linkedinUrl || '')}`),
        { headers: { Accept: 'application/json' } }
      );

      let profileData: any = {};
      if (res.ok) {
        profileData = await res.json();
      }

      /* Store local session state */
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_phone', number);
      localStorage.setItem('user_linkedin_input', linkedinUrl);
      localStorage.setItem('profile_name', profileData.name ?? name);
      localStorage.setItem('profile_email', profileData.email ?? email);
      localStorage.setItem('profile_phone', profileData.phone ?? number);
      localStorage.setItem('profile_linkedin', profileData.linkedin ?? linkedinUrl);

      router.push('/dashboard');
    } catch (err: any) {
      console.warn('Backend profile fallback during login:', err);
      // Still proceed with user state
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_phone', number);
      localStorage.setItem('user_linkedin_input', linkedinUrl);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-300/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Col: Brand Pitch */}
        <div className="md:col-span-5 gradient-brand p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="p-1.5 rounded-lg bg-white/20 text-white">
                <Zap size={18} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                AI Job Hunter
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-4">
              Your AI-Powered Career Command Center
            </h2>

            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed mb-6">
              Access real-time job pipelines, automated Google Maps lead extraction, and resume ATS intelligence.
            </p>

            <div className="space-y-2.5 text-xs font-semibold text-purple-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-300 flex-shrink-0" />
                <span>Automated tech role scraper</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-300 flex-shrink-0" />
                <span>Verified CSV lead export engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-300 flex-shrink-0" />
                <span>ATS Resume match optimizer</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 relative z-10 text-[11px] text-purple-200">
            © {new Date().getFullYear()} AI Job Hunter. All rights reserved.
          </div>
        </div>

        {/* Right Col: Sign In Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your credentials or use the demo login.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    type="tel"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold text-xs gradient-brand rounded-xl shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
