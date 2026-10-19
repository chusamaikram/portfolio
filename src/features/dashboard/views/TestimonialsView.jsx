import React, { useState, useRef } from 'react';
import {
  MessageSquareQuote,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';

export const TestimonialsView = ({
  testimonials = [],
  onAddTestimonial,
  onEditTestimonial,
  onDeleteTestimonial,
  onToggleVisibility,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
    visible: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, val) => {
    let err = '';
    const trimmed = typeof val === 'string' ? val.trim() : val;

    if (field === 'name') {
      if (!trimmed) err = 'Client name is required.';
      else if (trimmed.length < 2) err = 'Name must be at least 2 characters.';
    }

    if (field === 'role') {
      if (!trimmed) err = 'Professional role is required.';
      else if (trimmed.length < 2) err = 'Role must be at least 2 characters.';
    }

    if (field === 'company') {
      if (!trimmed) err = 'Company / organization is required.';
    }

    if (field === 'content') {
      if (!trimmed) err = 'Review content is required.';
      else if (trimmed.length < 10) err = 'Review must be at least 10 characters.';
    }

    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setForm((prev) => ({ ...prev, avatar: loadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      role: 'Engineering Lead',
      company: 'Tech Studio',
      content: '',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      visible: true,
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingItem(t);
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      rating: t.rating || 5,
      avatar: t.avatar || '',
      visible: t.visible !== false,
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    ['name', 'role', 'company', 'content'].forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, role: true, company: true, content: true });
      return;
    }

    if (editingItem) {
      onEditTestimonial(editingItem.id, form);
    } else {
      onAddTestimonial(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-cyan-400" />
            Client Endorsements & Peer Reviews ({testimonials.length})
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Manage verified client reviews and recommendations displayed across your portfolio
          </p>
        </div>

        <NeonButton
          size="sm"
          variant="primary"
          onClick={handleOpenAdd}
          icon={Plus}
        >
          Add New Testimonial
        </NeonButton>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <GlassCard
            key={t.id}
            cyberCorners
            glowColor="purple"
            className={`p-6 flex flex-col justify-between ${
              !t.visible ? 'opacity-60 border-dashed border-white/20' : ''
            }`}
          >
            <div>
              {/* Top Row: Stars & Visibility */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleVisibility(t.id, !t.visible)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      t.visible
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}
                    title={t.visible ? 'Click to hide from public' : 'Click to show on public'}
                  >
                    {t.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{t.visible ? 'LIVE' : 'HIDDEN'}</span>
                  </button>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-300 italic mb-6 leading-relaxed line-clamp-4">
                "{t.content}"
              </p>
            </div>

            {/* Author details & actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400/30 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] font-mono text-cyan-400">
                    {t.role}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500">{t.company}</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTestimonial(t.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add / Edit Testimonial Modal with Avatar Upload & Validation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <GlassCard cyberCorners glowColor="purple" className="p-6 sm:p-8">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit Testimonial' : 'Record Client Endorsement'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">CLIENT NAME *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. David Chen"
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
                    <label className="text-slate-300 block mb-1">COMPANY *</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      onBlur={() => handleBlur('company')}
                      placeholder="e.g. Aura Health & Web"
                      className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                        touched.company && errors.company
                          ? 'border-rose-500/60 bg-rose-950/10'
                          : 'border-white/15 focus:border-cyan-400'
                      }`}
                    />
                    {touched.company && errors.company && (
                      <p className="text-rose-400 text-[10px] pt-1">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">ROLE *</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      onBlur={() => handleBlur('role')}
                      placeholder="e.g. VP of Engineering"
                      className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                        touched.role && errors.role
                          ? 'border-rose-500/60 bg-rose-950/10'
                          : 'border-white/15 focus:border-cyan-400'
                      }`}
                    />
                    {touched.role && errors.role && (
                      <p className="text-rose-400 text-[10px] pt-1">{errors.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">RATING (1 - 5 STARS)</label>
                    <select
                      value={form.rating}
                      onChange={(e) => handleChange('rating', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Upload with live preview */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <label className="text-slate-300 block font-bold">CLIENT AVATAR</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={form.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border border-cyan-400/40 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white text-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload Custom Avatar</span>
                      </button>
                      <input
                        type="url"
                        value={form.avatar}
                        onChange={(e) => handleChange('avatar', e.target.value)}
                        placeholder="Or paste image URL: https://..."
                        className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">CLIENT ENDORSEMENT / REVIEW *</label>
                    <span className="text-[10px] text-slate-400">
                      {form.content?.trim().length || 0} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    onBlur={() => handleBlur('content')}
                    placeholder="Describe collaboration, frontend deliverables, layout speed, and code quality..."
                    className={`w-full bg-slate-900 border rounded-xl p-3 text-white font-sans text-sm resize-none focus:outline-none transition-all ${
                      touched.content && errors.content
                        ? 'border-rose-500/60 bg-rose-950/10'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {touched.content && errors.content && (
                    <p className="text-rose-400 text-[10px] pt-1">{errors.content}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="visibleCheck"
                    checked={form.visible}
                    onChange={(e) => handleChange('visible', e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="visibleCheck" className="text-slate-300 cursor-pointer">
                    Visible immediately on public portfolio
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>

                  <NeonButton type="submit" size="sm" variant="primary">
                    {editingItem ? 'Save Endorsement' : 'Publish Review'}
                  </NeonButton>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsView;
