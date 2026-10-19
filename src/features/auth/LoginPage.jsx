import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Key, User, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import GlassCard from '../../components/ui/GlassCard.jsx';
import NeonButton from '../../components/ui/NeonButton.jsx';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateField = (field, val) => {
    let err = '';
    const trimmed = String(val || '').trim();
    if (field === 'username') {
      if (!trimmed) err = 'Username is required.';
      else if (trimmed.length < 3) err = 'Username must be at least 3 characters.';
    }
    if (field === 'password') {
      if (!val) err = 'Passphrase is required.';
      else if (val.length < 4) err = 'Passphrase must be at least 4 characters.';
    }
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, field === 'username' ? username : password);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, val) => {
    if (field === 'username') setUsername(val);
    if (field === 'password') setPassword(val);

    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const uErr = validateField('username', username);
    const pErr = validateField('password', password);
    if (uErr || pErr) {
      setErrors({ username: uErr, password: pErr });
      setTouched({ username: true, password: true });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username, password);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Authentication failed. Use admin / admin123 for demo mode.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      {/* Background cyber radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Public Portfolio link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Portfolio</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard cyberCorners glowColor="cyan" className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 text-[10px] font-mono tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              RESTRICTED ADMIN ACCESS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Control Gateway
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Authenticate to manage portfolio assets & telemetry
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ADMIN USERNAME *</span>
                </label>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                placeholder="admin"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono transition-all ${
                  touched.username && errors.username
                    ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                    : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              />
              {touched.username && errors.username && (
                <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.username}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ACCESS PASSPHRASE *</span>
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono transition-all ${
                  touched.password && errors.password
                    ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                    : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              />
              {touched.password && errors.password && (
                <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <NeonButton
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full mt-4"
            >
              Verify & Enter Console
            </NeonButton>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              EVALUATOR DEMO CREDENTIALS:
            </div>
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
              <span>user: <strong className="text-white">admin</strong></span>
              <span className="text-white/20">•</span>
              <span>pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;
