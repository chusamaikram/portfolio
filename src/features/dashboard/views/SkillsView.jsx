import React, { useState } from 'react';
import { Cpu, Plus, Save, Trash2, Sliders, AlertCircle, CheckCircle2, X } from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';

export const SkillsView = ({ skills = [], setSkills, onSaveSkills }) => {
  const [newSkillModal, setNewSkillModal] = useState(false);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    level: 80,
    highlight: '',
  });
  const [formError, setFormError] = useState('');

  const handleLevelChange = (catIdx, skillIdx, val) => {
    setSkills((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[catIdx].skills[skillIdx].level = Number(val);
      return copy;
    });
  };

  const handleDeleteSkill = (catIdx, skillIdx) => {
    setSkills((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[catIdx].skills.splice(skillIdx, 1);
      return copy;
    });
  };

  const handleAddSkillSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const trimmed = newSkillForm.name.trim();
    if (!trimmed) {
      setFormError('Technology name is required.');
      return;
    }
    if (trimmed.length < 2) {
      setFormError('Technology name must be at least 2 characters.');
      return;
    }

    // Check duplicate
    const targetCat = skills[selectedCategoryIdx];
    if (
      targetCat?.skills?.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setFormError(`"${trimmed}" already exists in ${targetCat.name}.`);
      return;
    }

    setSkills((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[selectedCategoryIdx].skills.push({
        name: trimmed,
        level: Number(newSkillForm.level) || 75,
        highlight: newSkillForm.highlight.trim() || 'Production ready',
        icon: 'Code',
      });
      return copy;
    });

    setNewSkillForm({ name: '', level: 80, highlight: '' });
    setNewSkillModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Skills Matrix & Proficiency Calibration
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Adjust real-time proficiency bars displayed on the public Bento matrix
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => {
              setFormError('');
              setNewSkillModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 text-xs font-mono transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Skill to Matrix</span>
          </button>

          <NeonButton
            size="sm"
            variant="primary"
            onClick={onSaveSkills}
            icon={Save}
          >
            Save All Changes
          </NeonButton>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {skills.map((cat, catIdx) => (
          <GlassCard key={cat.name} cyberCorners glowColor="cyan" className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
                  {cat.name} ({cat.skills.length})
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategoryIdx(catIdx);
                    setFormError('');
                    setNewSkillModal(true);
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill, skillIdx) => (
                  <div key={skill.name} className="space-y-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">{skill.level}%</span>
                        <button
                          onClick={() => handleDeleteSkill(catIdx, skillIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => handleLevelChange(catIdx, skillIdx, e.target.value)}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                    />

                    {skill.highlight && (
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        // {skill.highlight}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Skill Modal with Validation */}
      {newSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <GlassCard cyberCorners glowColor="cyan" className="p-6">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  Add Technology to Matrix
                </h3>
                <button
                  onClick={() => setNewSkillModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSkillSubmit} noValidate className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">TARGET SECTOR / CATEGORY</label>
                  <select
                    value={selectedCategoryIdx}
                    onChange={(e) => setSelectedCategoryIdx(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                  >
                    {skills.map((cat, i) => (
                      <option key={cat.name} value={i}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">TECHNOLOGY NAME *</label>
                  <input
                    type="text"
                    value={newSkillForm.name}
                    onChange={(e) => {
                      setNewSkillForm({ ...newSkillForm, name: e.target.value });
                      if (formError) setFormError('');
                    }}
                    placeholder="e.g. Docker, GraphQL, Jest, Zustand"
                    className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white font-sans text-sm focus:outline-none transition-all ${
                      formError
                        ? 'border-rose-500/60 bg-rose-950/10'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {formError && (
                    <p className="text-rose-400 text-[10px] font-mono flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">INITIAL PROFICIENCY LEVEL</label>
                    <span className="text-cyan-400 font-bold">{newSkillForm.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newSkillForm.level}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, level: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">HIGHLIGHT / NOTE</label>
                  <input
                    type="text"
                    value={newSkillForm.highlight}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, highlight: e.target.value })}
                    placeholder="e.g. Enterprise microservices, CI/CD"
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setNewSkillModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>

                  <NeonButton type="submit" size="sm" variant="primary">
                    Confirm & Append
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

export default SkillsView;
