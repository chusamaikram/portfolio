import React, { useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, Calendar, Building, AlertCircle, CheckCircle2, X } from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';
import TechBadge from '../../../components/ui/TechBadge.jsx';

export const ExperienceView = ({
  experiences = [],
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, val) => {
    let err = '';
    const trimmed = typeof val === 'string' ? val.trim() : val;

    if (field === 'role') {
      if (!trimmed) err = 'Role / position title is required.';
      else if (trimmed.length < 2) err = 'Role must be at least 2 characters.';
    }

    if (field === 'company') {
      if (!trimmed) err = 'Organization / company name is required.';
      else if (trimmed.length < 2) err = 'Company must be at least 2 characters.';
    }

    if (field === 'period') {
      if (!trimmed) err = 'Timeline / period is required.';
    }

    if (field === 'description') {
      if (!trimmed) err = 'Milestone summary is required.';
      else if (trimmed.length < 10) err = 'Description must be at least 10 characters.';
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

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      role: '',
      company: '',
      period: '2026 - Present',
      description: '',
      tags: 'React 19, Tailwind CSS, TypeScript',
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingItem(exp);
    setForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      tags: Array.isArray(exp.tags) ? exp.tags.join(', ') : exp.tags || '',
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    ['role', 'company', 'period', 'description'].forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ role: true, company: true, period: true, description: true });
      return;
    }

    if (editingItem) {
      onEditExperience(editingItem.id, form);
    } else {
      onAddExperience(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Career Milestones & Engineering Experience ({experiences.length})
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Chronological track of professional positions, contracts, and open-source contributions
          </p>
        </div>

        <NeonButton
          size="sm"
          variant="primary"
          onClick={handleOpenAdd}
          icon={Plus}
        >
          Add Career Milestone
        </NeonButton>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <GlassCard key={exp.id} cyberCorners glowColor="cyan" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    STAGE #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {exp.company}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteExperience(exp.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4">
              {exp.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
              {exp.tags?.map((tag) => (
                <TechBadge key={tag} name={tag} variant="default" className="text-[11px]" />
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add / Edit Experience Modal with Validation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit Career Milestone' : 'Record Career Milestone'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">ROLE / TITLE *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    onBlur={() => handleBlur('role')}
                    placeholder="e.g. Senior Frontend Architect"
                    className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white font-sans text-sm focus:outline-none transition-all ${
                      touched.role && errors.role
                        ? 'border-rose-500/60 bg-rose-950/10'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {touched.role && errors.role && (
                    <p className="text-rose-400 text-[10px] pt-1">{errors.role}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">ORGANIZATION / COMPANY *</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      onBlur={() => handleBlur('company')}
                      placeholder="e.g. Aura Health / Freelance"
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

                  <div>
                    <label className="text-slate-300 block mb-1">TIMELINE / PERIOD *</label>
                    <input
                      type="text"
                      value={form.period}
                      onChange={(e) => handleChange('period', e.target.value)}
                      onBlur={() => handleBlur('period')}
                      placeholder="e.g. 2026 - Present"
                      className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                        touched.period && errors.period
                          ? 'border-rose-500/60 bg-rose-950/10'
                          : 'border-white/15 focus:border-cyan-400'
                      }`}
                    />
                    {touched.period && errors.period && (
                      <p className="text-rose-400 text-[10px] pt-1">{errors.period}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">MILESTONE HIGHLIGHTS / SUMMARY *</label>
                    <span className="text-[10px] text-slate-400">
                      {form.description?.trim().length || 0} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    placeholder="Responsibilities, architecture decisions, frameworks employed, and performance wins..."
                    className={`w-full bg-slate-900 border rounded-xl p-3 text-white font-sans text-sm resize-none focus:outline-none transition-all ${
                      touched.description && errors.description
                        ? 'border-rose-500/60 bg-rose-950/10'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {touched.description && errors.description && (
                    <p className="text-rose-400 text-[10px] pt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">TECH STACK (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="React 19, Tailwind CSS, Three.js, Zustand"
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                  />
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
                    {editingItem ? 'Save Milestone' : 'Record Milestone'}
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

export default ExperienceView;
