import React, { useState, useEffect } from 'react';
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
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';
import { API_BASE_URL, ENDPOINTS } from '../../../api/endpoints.js';
import axiosInstance from '../../../api/axiosInstance.js';
import profileFallbackImg from '../../../images/profile.webp';
import aboutFallbackImg from '../../../images/about.webp';

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingAboutImg, setIsUploadingAboutImg] = useState(false);

  useEffect(() => {
    if (profileInfo && Object.keys(profileInfo).length > 0) {
      setProfileForm((prev) => ({ ...prev, ...profileInfo }));
    }
  }, [profileInfo]);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select a valid image file (PNG, JPG, WebP, GIF).',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image file size must be under 5MB.',
      });
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setProfileForm((prev) => ({ ...prev, avatar: dataUrl }));
      setIsUploadingAvatar(false);
      toast.success('Avatar image loaded! Click Save to apply changes.');
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      toast.error('Failed reading image file');
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    setProfileForm((prev) => ({ ...prev, avatar: '' }));
    toast.info('Reverted to default Usama Ikram profile image. Click Save to persist.');
  };

  const handleAboutImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select a valid image file (PNG, WebP, JPG).',
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image file size must be under 8MB.',
      });
      return;
    }

    setIsUploadingAboutImg(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setProfileForm((prev) => ({ ...prev, about_image: dataUrl }));
      setIsUploadingAboutImg(false);
      toast.success('About section cutout portrait loaded! Click Save to apply.');
    };
    reader.onerror = () => {
      setIsUploadingAboutImg(false);
      toast.error('Failed reading image file');
    };
    reader.readAsDataURL(file);
  };

  const handleResetAboutImage = () => {
    setProfileForm((prev) => ({ ...prev, about_image: '' }));
    toast.info('Reverted to default About section cutout portrait. Click Save to persist.');
  };

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
          {/* Avatar / Profile Headshot Management */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Live Preview Box with cybernetic frame */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.25)] bg-slate-950 relative">
                  <img
                    src={profileForm.avatar || profileFallbackImg}
                    alt={profileForm.name || 'Profile Avatar'}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-[9px] uppercase font-bold tracking-wider">
                  {profileForm.avatar ? 'CUSTOM' : 'DEFAULT'}
                </span>
              </div>

              {/* Upload & Configuration controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    OPERATOR HEADSHOT // GENERAL AVATAR
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    This avatar image is used for site navigation, metadata, and general profile identification. Upload a file or paste a URL.
                  </p>
                </div>

                {/* Upload or URL fields */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-300 block mb-1 text-[11px]">UPLOAD IMAGE (PNG, JPG, WEBP)</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 hover:border-cyan-400 text-slate-200 text-xs cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>{isUploadingAvatar ? 'Reading...' : 'Choose File...'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 text-[11px]">OR PASTE IMAGE URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={profileForm.avatar || ''}
                      onChange={(e) => handleChange('avatar', e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick actions: Reset to default or clear */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={handleResetAvatar}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    Reset to Default Photo
                  </button>
                  {profileForm.avatar && (
                    <button
                      type="button"
                      onClick={() => handleChange('avatar', '')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      Clear Custom Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated About Section Cutout Portrait Management */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Live Preview Box */}
              <div className="relative group shrink-0">
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.2)] bg-slate-950 flex items-end justify-center relative">
                  <img
                    src={profileForm.about_image || profileForm.avatar || aboutFallbackImg}
                    alt={profileForm.name || 'About Cutout Portrait'}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                  {isUploadingAboutImg && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-[9px] uppercase font-bold tracking-wider">
                  {profileForm.about_image ? 'CUSTOM' : 'DEFAULT'}
                </span>
              </div>

              {/* Upload & Configuration controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    ABOUT SECTION STICKY CUTOUT PORTRAIT
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    This transparent cutout portrait stays pinned in the center of the About section while side columns scroll. Upload a transparent cutout PNG or WebP, or enter an image URL.
                  </p>
                </div>

                {/* Upload or URL fields */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-300 block mb-1 text-[11px]">UPLOAD CUTOUT (PNG, WEBP, JPG)</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 hover:border-emerald-400 text-slate-200 text-xs cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>{isUploadingAboutImg ? 'Reading...' : 'Choose Cutout File...'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 text-[11px]">OR PASTE CUTOUT IMAGE URL</label>
                    <input
                      type="url"
                      placeholder="https://.../portrait-cutout.png"
                      value={profileForm.about_image || ''}
                      onChange={(e) => handleChange('about_image', e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick actions: Reset to default or clear */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={handleResetAboutImage}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    Reset to Default About Image
                  </button>
                  {profileForm.about_image && (
                    <button
                      type="button"
                      onClick={() => handleChange('about_image', '')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      Clear Custom Cutout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

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

          {/* Active 3D Hero Visual Mode */}
          <div className="pt-2 pb-2">
            <label className="text-slate-300 block mb-2 font-mono text-xs uppercase tracking-wider">
              ACTIVE 3D HERO SHOWCASE MODE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'laptop',
                  title: '3D Tech Laptop',
                  desc: 'Assembles on load/scroll, stationary & calm when assembled, ambient waves only',
                },
                {
                  id: 'brain',
                  title: 'AI Neural Core',
                  desc: 'Organic anatomical brain lobes, cursor-reactive parallax tilt & synaptic glow',
                },
                {
                  id: 'globe',
                  title: '3D Holographic Globe',
                  desc: 'Revolving 360° sphere with 6 programming language symbol nodes in authentic brand colors',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleChange('hero_visual_type', opt.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    (profileForm.hero_visual_type || 'laptop') === opt.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs font-mono">{opt.title}</span>
                    {(profileForm.hero_visual_type || 'laptop') === opt.id && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{opt.desc}</p>
                </div>
              ))}
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
