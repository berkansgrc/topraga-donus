import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ViewState } from '../types';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  setView: (view: ViewState) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setView(ViewState.ADMIN_DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-base px-4">
      <div className="bg-white p-8 rounded-card shadow-card max-w-md w-full border border-border">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="flex items-center text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Ana Sayfaya Dön
        </button>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-soft rounded-full text-primary">
            <Lock size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Yönetici Girişi</h2>
        <p className="text-center text-text-secondary mb-8 text-sm">
          İçerik yönetim paneline erişmek için giriş yapın.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-input border border-border bg-background-base focus:ring-2 focus:ring-primary-soft focus:border-primary outline-none transition-all"
              placeholder="admin@topragadonus.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-input border border-border bg-background-base focus:ring-2 focus:ring-primary-soft focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3.5 rounded-button shadow-soft hover:shadow-card transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;