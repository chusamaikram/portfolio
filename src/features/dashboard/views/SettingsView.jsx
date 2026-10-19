import React, { useState } from 'react';
import {
  Sliders,
  User,
  Activity,
  Download,
  RotateCcw,
  Save,
  CheckCircle,
  ExternalLink,
  Shield,
  Server,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';
import { API_BASE_URL, ENDPOINTS } from '../../../api/endpoints.js';
import axiosInstance from '../../../api/axiosInstance.js';

export const SettingsView = ({
  profileInfo,
  onUpdateProfile,
  onResetAllData,
  getAllExportData,
}) => {
  const [profileForm, setProfileForm] = useState(profileInfo || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [pingResult, setPingResult] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  const validateField = (field, val) => {
    let err = '';
    const trimmed = typeof val === 'string' ? val.trim() : val;

    if (field === 'name') {
      if (!trimmed) err = 'Name is required.';
      else if (trimmed.length < 2) err = 'Name must be at least 2 characters.';
    }

    if (field === 'title') {
      if (!trimmed) err = 'Title / position is required.';
      else if (trimmed.length < 3) err = 'Title must be at least 3 characters.';
    }

    if (field === 'email' && trimmed) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
        err = 'Provide a valid email format (e.g. name@domain.com).';
      }
    }

    if (field === 'github' && trimmed) {
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        err = 'Must be a valid URL starting with http:// or https://';
      }
    }

    if (field === 'linkedin' && trimmed) {
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        err = 'Must be a valid URL starting with http:// or https://';
      }
    }

    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, profileForm[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, val) => {
    setProfileForm((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    ['name', 'title', 'email', 'github', 'linkedin'].forEach((f) => {
      const err = validateField(f, profileForm[f]);
      if (err) newErrors[f] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, title: true, email: true, github: true, linkedin: true });
      toast.error('Validation Warning', { description: 'Please resolve errors in the profile form.' });
      return;
    }

    onUpdateProfile(profileForm);
    toast.success('Public profile information updated!');
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await axiosInstance.get(ENDPOINTS.PORTFOLIO.BASE, { timeout: 3500 });
      const duration = Math.round(performance.now() - start);
      setPingResult({ online: true, latency: `${duration}ms` });
      toast.success(`Server Online (${duration}ms)`);
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setPingResult({
        online: false,
        latency: `${duration}ms`,
        msg: 'Backend offline. Local persistence active.',
      });
      toast.info('Local heuristic persistence active (Backend offline)');
    } finally {
      setIsPinging(false);
    }
  };

  const handleExportJSON = () => {
    const data = getAllExportData ? getAllExportData() : {};
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usama-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Portfolio database backup downloaded!');
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8">
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-white/10">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Public Profile & Identity Specifications
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} noValidate className="space-y-4 text-xs font-mono">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">OPERATOR NAME *</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white font-sans text-sm focus:outline-none transition-all ${
                  touched.name && errors.name
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : 'border-white/15 focus:border-cyan-400'
                }`}
              />
              {touched.name && errors.name && (
                <p className="text-rose-400 text-[10px] pt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-slate-300 block mb-1">TITLE / POSITION *</label>
              <input
                type="text"
                value={profileForm.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                  touched.title && errors.title
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : 'border-white/15 focus:border-cyan-400'
                }`}
              />
              {touched.title && errors.title && (
                <p className="text-rose-400 text-[10px] pt-1">{errors.title}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">ENGINEERING BIO / SUMMARY</label>
            <textarea
              rows={3}
              value={profileForm.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl p-3 text-white font-sans text-sm resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">LOCATION</label>
              <input
                type="text"
                value={profileForm.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">PUBLIC EMAIL</label>
              <input
                type="email"
                value={profileForm.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                  touched.email && errors.email
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : 'border-white/15 focus:border-cyan-400'
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-rose-400 text-[10px] pt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-slate-300 block mb-1">PHONE NUMBER</label>
              <input
                type="text"
                value={profileForm.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">GITHUB REPO URL</label>
              <input
                type="url"
                value={profileForm.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                onBlur={() => handleBlur('github')}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                  touched.github && errors.github
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : 'border-white/15 focus:border-cyan-400'
                }`}
              />
              {touched.github && errors.github && (
                <p className="text-rose-400 text-[10px] pt-1">{errors.github}</p>
              )}
            </div>

            <div>
              <label className="text-slate-300 block mb-1">LINKEDIN URL</label>
              <input
                type="url"
                value={profileForm.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                onBlur={() => handleBlur('linkedin')}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                  touched.linkedin && errors.linkedin
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : 'border-white/15 focus:border-cyan-400'
                }`}
              />
              {touched.linkedin && errors.linkedin && (
                <p className="text-rose-400 text-[10px] pt-1">{errors.linkedin}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <NeonButton type="submit" size="sm" variant="primary" icon={Save}>
              Save Profile Specifications
            </NeonButton>
          </div>
        </form>
      </GlassCard>

      {/* Infrastructure & Telemetry Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Backend Connect */}
        <GlassCard cyberCorners glowColor="blue" className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Backend API Gateway
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-slate-400">Target BaseURL:</span>
              <span className="text-cyan-300">{API_BASE_URL}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-slate-400">Endpoints:</span>
              <span className="text-slate-200">/api/v1/portfolio/</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-slate-400">Authorization:</span>
              <span className="text-emerald-400">Bearer JWT In-Memory</span>
            </div>
          </div>

          {pingResult && (
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Status:</span>
                <span className={pingResult.online ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {pingResult.online ? 'ONLINE' : 'FALLBACK ACTIVE'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Round-Trip Latency:</span>
                <span className="text-cyan-400">{pingResult.latency}</span>
              </div>
            </div>
          )}

          <NeonButton
            size="sm"
            variant="outline"
            onClick={handleTestPing}
            isLoading={isPinging}
            icon={Activity}
            className="w-full"
          >
            Trigger API Handshake Ping
          </NeonButton>
        </GlassCard>

        {/* Database Backup & Disaster Recovery */}
        <GlassCard cyberCorners glowColor="purple" className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Database Snapshots & Reset
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed mt-3">
              Export all projects, skill matrix calibrations, testimonials, career milestones, and contact logs into a portable JSON document.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-mono transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Database Backup (JSON)</span>
            </button>

            <button
              onClick={onResetAllData}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Entire Portfolio to Factory Defaults</span>
            </button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default SettingsView;
