import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardSidebar from './DashboardSidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import OverviewView from './views/OverviewView.jsx';
import ProjectsView from './views/ProjectsView.jsx';
import SkillsView from './views/SkillsView.jsx';
import TestimonialsView from './views/TestimonialsView.jsx';
import MessagesView from './views/MessagesView.jsx';
import ExperienceView from './views/ExperienceView.jsx';
import SettingsView from './views/SettingsView.jsx';
import GlassCard from '../../components/ui/GlassCard.jsx';
import NeonButton from '../../components/ui/NeonButton.jsx';
import portfolioService, { ASSETS } from '../../services/portfolio.service.js';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [profileInfo, setProfileInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Project Add/Edit Modal State with Thumbnail & Validation
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [thumbnailMode, setThumbnailMode] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Web App',
    description: '',
    tags: 'React.js, Tailwind CSS',
    image: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    architecture: '',
  });
  const [projectErrors, setProjectErrors] = useState({});
  const [projectTouched, setProjectTouched] = useState({});

  // Preset Catalog Assets for quick selection
  const PRESET_THUMBNAILS = [
    { name: 'ZeeFrames', img: ASSETS.zeeframes },
    { name: 'Olyra', img: ASSETS.olyra },
    { name: 'Dentalook', img: ASSETS.dentalook },
    { name: 'GMHS', img: ASSETS.gmhs },
    { name: 'Zapta', img: ASSETS.zapta },
    { name: 'Weather', img: ASSETS.weather },
  ];

  // Load All Dashboard Datasets
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [p, s, t, m, exp] = await Promise.all([
        portfolioService.getProjects(),
        portfolioService.getSkills(),
        portfolioService.getTestimonials(),
        portfolioService.getMessages(),
        portfolioService.getExperiences(),
      ]);
      const prof = portfolioService.getProfileInfo();

      setProjects(p);
      setSkills(s);
      setTestimonials(t);
      setMessages(m);
      setExperiences(exp);
      setProfileInfo(prof);
    } catch (err) {
      toast.error('Failed refreshing operations data');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Quick Action Config by active tab
  const getQuickActionConfig = () => {
    switch (activeTab) {
      case 'projects':
        return {
          label: '+ New Project',
          action: () => handleOpenAddProject(),
        };
      case 'testimonials':
        return {
          label: '+ New Endorsement',
          action: () => setActiveTab('testimonials'),
        };
      case 'experience':
        return {
          label: '+ New Milestone',
          action: () => setActiveTab('experience'),
        };
      default:
        return {
          label: '+ New Project',
          action: () => handleOpenAddProject(),
        };
    }
  };

  const currentTabLabel = {
    overview: 'Operations Overview',
    projects: 'Project Catalog',
    skills: 'Technical Skills Matrix',
    testimonials: 'Client Testimonials',
    messages: 'Inbound Inquiries',
    experience: 'Career Milestones',
    telemetry: 'System Telemetry',
    settings: 'Settings & Profile',
  }[activeTab] || 'Mission Control';

  // Project Form Validation
  const validateProjectField = (name, value) => {
    let err = '';
    const trimmed = typeof value === 'string' ? value.trim() : value;

    if (name === 'title') {
      if (!trimmed) err = 'Project title is required.';
      else if (trimmed.length < 3) err = 'Title must be at least 3 characters.';
    }

    if (name === 'description') {
      if (!trimmed) err = 'Description is required.';
      else if (trimmed.length < 10) err = 'Description must be at least 10 characters.';
    }

    if (name === 'image') {
      if (!value) err = 'Project thumbnail image is required. Upload an image or choose a preset.';
    }

    if (name === 'tags') {
      if (!trimmed) err = 'Provide at least one technology tag.';
    }

    if (name === 'liveUrl' && trimmed) {
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        err = 'Must be a valid URL starting with http:// or https://';
      }
    }

    if (name === 'githubUrl' && trimmed) {
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        err = 'Must be a valid URL starting with http:// or https://';
      }
    }

    return err;
  };

  const validateAllProjectFields = (data) => {
    const errs = {};
    ['title', 'description', 'image', 'tags', 'liveUrl', 'githubUrl'].forEach((field) => {
      const err = validateProjectField(field, data[field]);
      if (err) errs[field] = err;
    });
    return errs;
  };

  // Thumbnail file upload handler
  const handleThumbnailFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please select an image file (PNG, JPG, WebP, etc.).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Please choose an image under 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setProjectForm((prev) => ({ ...prev, image: dataUrl }));
      setProjectErrors((prev) => ({ ...prev, image: '' }));
      toast.success('Thumbnail loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Project CRUD
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Web App',
      description: '',
      tags: 'React.js, Tailwind CSS',
      image: ASSETS.zeeframes, // default valid preview
      liveUrl: '',
      githubUrl: '',
      featured: false,
      architecture: '',
    });
    setProjectErrors({});
    setProjectTouched({});
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      category: proj.category || 'Web App',
      description: proj.description || '',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags || '',
      image: proj.image || ASSETS.zeeframes,
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: Boolean(proj.featured),
      architecture: proj.architecture || '',
    });
    setProjectErrors({});
    setProjectTouched({});
    setIsProjectModalOpen(true);
  };

  const handleProjectFieldChange = (name, value) => {
    setProjectForm((prev) => ({ ...prev, [name]: value }));
    if (projectTouched[name]) {
      const err = validateProjectField(name, value);
      setProjectErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleProjectFieldBlur = (name) => {
    setProjectTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateProjectField(name, projectForm[name]);
    setProjectErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();

    const errs = validateAllProjectFields(projectForm);
    if (Object.keys(errs).length > 0) {
      setProjectErrors(errs);
      setProjectTouched({
        title: true,
        description: true,
        image: true,
        tags: true,
        liveUrl: true,
        githubUrl: true,
      });
      toast.error('Project Validation Error', {
        description: 'Please correct highlighted errors and provide a project thumbnail.',
      });
      return;
    }

    try {
      if (editingProject) {
        const updated = await portfolioService.updateProject(editingProject.id, {
          ...projectForm,
          tags: projectForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        });
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...updated } : p))
        );
        toast.success(`Project "${projectForm.title}" updated!`);
      } else {
        const created = await portfolioService.createProject(projectForm);
        setProjects((prev) => [created, ...prev]);
        toast.success(`Project "${projectForm.title}" deployed!`);
      }
      setIsProjectModalOpen(false);
    } catch {
      toast.error('Could not save project');
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await portfolioService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleResetProjects = () => {
    if (window.confirm('Reset project catalog back to factory defaults?')) {
      const reset = portfolioService.resetProjects();
      setProjects(reset);
      toast.success('Projects reset to default baseline');
    }
  };

  // Skills
  const handleSaveSkills = async () => {
    try {
      await portfolioService.updateSkills(skills);
      toast.success('Skills matrix persisted successfully!');
    } catch {
      toast.error('Failed saving skills matrix');
    }
  };

  // Testimonials
  const handleAddTestimonial = async (data) => {
    try {
      const created = await portfolioService.createTestimonial(data);
      setTestimonials((prev) => [created, ...prev]);
      toast.success('Testimonial added!');
    } catch {
      toast.error('Failed adding testimonial');
    }
  };

  const handleEditTestimonial = async (id, data) => {
    try {
      const updated = await portfolioService.updateTestimonial(id, data);
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      toast.success('Testimonial updated!');
    } catch {
      toast.error('Failed updating testimonial');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      await portfolioService.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleTestimonialVisibility = async (id, visible) => {
    try {
      const updated = await portfolioService.updateTestimonial(id, { visible });
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      toast.success(visible ? 'Testimonial is now LIVE' : 'Testimonial is now HIDDEN');
    } catch {
      toast.error('Failed toggling visibility');
    }
  };

  // Messages
  const handleMarkMessageRead = async (id) => {
    try {
      const updated = await portfolioService.markMessageRead(id);
      setMessages(updated);
      toast.success('Marked as read');
    } catch {
      toast.error('Failed updating status');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete message from inbox?')) return;
    try {
      await portfolioService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  // Experience
  const handleAddExperience = async (data) => {
    try {
      const created = await portfolioService.createExperience(data);
      setExperiences((prev) => [created, ...prev]);
      toast.success('Milestone added!');
    } catch {
      toast.error('Failed adding milestone');
    }
  };

  const handleEditExperience = async (id, data) => {
    try {
      const updated = await portfolioService.updateExperience(id, data);
      setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp)));
      toast.success('Milestone updated!');
    } catch {
      toast.error('Failed updating milestone');
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this career milestone?')) return;
    try {
      await portfolioService.deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      toast.success('Milestone deleted');
    } catch {
      toast.error('Failed to delete milestone');
    }
  };

  // Profile & Settings
  const handleUpdateProfile = (info) => {
    portfolioService.updateProfileInfo(info);
    setProfileInfo(info);
  };

  const handleResetAllData = () => {
    if (window.confirm('CRITICAL ACTION: Reset all portfolio databases (projects, skills, testimonials, messages, experiences) to default?')) {
      localStorage.clear();
      fetchAllData();
      toast.success('All databases restored to factory defaults');
    }
  };

  const getAllExportData = () => ({
    timestamp: new Date().toISOString(),
    profile: profileInfo,
    projects,
    skills,
    testimonials,
    messages,
    experiences,
  });

  const quickAction = getQuickActionConfig();

  return (
    <div className="min-h-screen bg-[#050814] text-white flex">
      
      {/* 1. Left Enterprise Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        counts={{
          projects: projects.length,
          skills: skills.reduce((a, c) => a + (c.skills?.length || 0), 0),
          testimonials: testimonials.length,
          unreadMessages: messages.filter((m) => !m.isRead).length,
          experience: experiences.length,
        }}
        onLogout={logout}
        user={user}
      />

      {/* 2. Main Content Canvas */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <DashboardHeader
          activeTabTitle={currentTabLabel}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickAction={quickAction.action}
          quickActionLabel={quickAction.label}
          onRefresh={fetchAllData}
          isRefreshing={isRefreshing}
        />

        {/* View Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-cyan-400 font-mono text-xs">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
              <span>HYDRATING DASHBOARD SERVICES...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  projects={projects}
                  skills={skills}
                  messages={messages}
                  testimonials={testimonials}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  searchQuery={searchQuery}
                  onAddProject={handleOpenAddProject}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleDeleteProject}
                  onResetProjects={handleResetProjects}
                />
              )}

              {activeTab === 'skills' && (
                <SkillsView
                  skills={skills}
                  setSkills={setSkills}
                  onSaveSkills={handleSaveSkills}
                />
              )}

              {activeTab === 'testimonials' && (
                <TestimonialsView
                  testimonials={testimonials}
                  onAddTestimonial={handleAddTestimonial}
                  onEditTestimonial={handleEditTestimonial}
                  onDeleteTestimonial={handleDeleteTestimonial}
                  onToggleVisibility={handleToggleTestimonialVisibility}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesView
                  messages={messages}
                  searchQuery={searchQuery}
                  onMarkRead={handleMarkMessageRead}
                  onDeleteMessage={handleDeleteMessage}
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceView
                  experiences={experiences}
                  onAddExperience={handleAddExperience}
                  onEditExperience={handleEditExperience}
                  onDeleteExperience={handleDeleteExperience}
                />
              )}

              {activeTab === 'telemetry' && (
                <SettingsView
                  profileInfo={profileInfo}
                  onUpdateProfile={handleUpdateProfile}
                  onResetAllData={handleResetAllData}
                  getAllExportData={getAllExportData}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  profileInfo={profileInfo}
                  onUpdateProfile={handleUpdateProfile}
                  onResetAllData={handleResetAllData}
                  getAllExportData={getAllExportData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Deploy / Edit Project Modal with Thumbnail Upload & Full Form Validation */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8">
            <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  {editingProject ? 'Edit Project Specifications' : 'Deploy New Project to Catalog'}
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} noValidate className="space-y-4 text-xs font-mono">
                
                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">PROJECT TITLE *</label>
                    {projectTouched.title && !projectErrors.title && projectForm.title && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => handleProjectFieldChange('title', e.target.value)}
                    onBlur={() => handleProjectFieldBlur('title')}
                    placeholder="e.g. Aura Health Dashboard"
                    className={`w-full bg-slate-900 border rounded-xl px-3.5 py-2.5 text-white font-sans text-sm focus:outline-none transition-all ${
                      projectTouched.title && projectErrors.title
                        ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {projectTouched.title && projectErrors.title && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{projectErrors.title}</span>
                    </p>
                  )}
                </div>

                {/* Category & Featured */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">CATEGORY</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => handleProjectFieldChange('category', e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Web App">Web App</option>
                      <option value="Dashboard">Dashboard</option>
                      <option value="Portfolio">Portfolio</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5 gap-2">
                    <input
                      type="checkbox"
                      id="dashFeatCheck"
                      checked={projectForm.featured}
                      onChange={(e) => handleProjectFieldChange('featured', e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                    />
                    <label htmlFor="dashFeatCheck" className="text-slate-300 cursor-pointer">
                      Featured Project
                    </label>
                  </div>
                </div>

                {/* THUMBNAIL UPLOAD / SELECTION SECTION */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      PROJECT THUMBNAIL *
                    </label>

                    {/* Mode toggles */}
                    <div className="flex gap-1 p-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setThumbnailMode('upload')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          thumbnailMode === 'upload' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnailMode('preset')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          thumbnailMode === 'preset' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnailMode('url')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          thumbnailMode === 'url' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: File Upload */}
                  {thumbnailMode === 'upload' && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 px-4 rounded-xl border border-dashed border-cyan-400/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
                      >
                        <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-xs text-white">Click to Upload Thumbnail Image</span>
                        <span className="text-[10px] text-slate-500">Supports PNG, JPG, WebP up to 5MB</span>
                      </button>
                    </div>
                  )}

                  {/* Mode 2: Preset Assets */}
                  {thumbnailMode === 'preset' && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_THUMBNAILS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setProjectForm((prev) => ({ ...prev, image: preset.img }));
                            setProjectErrors((prev) => ({ ...prev, image: '' }));
                          }}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all ${
                            projectForm.image === preset.img
                              ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                              : 'border-white/15 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.img} alt={preset.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-center text-white py-0.5 truncate">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mode 3: URL input */}
                  {thumbnailMode === 'url' && (
                    <div>
                      <input
                        type="url"
                        value={projectForm.image || ''}
                        onChange={(e) => handleProjectFieldChange('image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  )}

                  {/* Live Thumbnail Preview */}
                  {projectForm.image && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-cyan-400/40 bg-slate-950">
                      <img
                        src={projectForm.image}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-cyan-400 font-mono border border-cyan-400/30">
                          PREVIEW
                        </span>
                        <button
                          type="button"
                          onClick={() => setProjectForm((prev) => ({ ...prev, image: '' }))}
                          className="p-1 rounded bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {projectTouched.image && projectErrors.image && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{projectErrors.image}</span>
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">DESCRIPTION *</label>
                    <span className="text-[10px] text-slate-400">
                      {projectForm.description?.trim().length || 0} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => handleProjectFieldChange('description', e.target.value)}
                    onBlur={() => handleProjectFieldBlur('description')}
                    placeholder="Summarize project scope, challenges, architecture decisions, and deliverables..."
                    className={`w-full bg-slate-900 border rounded-xl p-3 text-white font-sans text-sm resize-none focus:outline-none transition-all ${
                      projectTouched.description && projectErrors.description
                        ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {projectTouched.description && projectErrors.description && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{projectErrors.description}</span>
                    </p>
                  )}
                </div>

                {/* Tech Tags */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300">TECH TAGS (comma-separated) *</label>
                  </div>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => handleProjectFieldChange('tags', e.target.value)}
                    onBlur={() => handleProjectFieldBlur('tags')}
                    placeholder="React.js, Tailwind CSS, Next.js, Three.js"
                    className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                      projectTouched.tags && projectErrors.tags
                        ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                        : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {projectTouched.tags && projectErrors.tags && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{projectErrors.tags}</span>
                    </p>
                  )}
                </div>

                {/* Live URL & GitHub URL */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">LIVE DEMO URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => handleProjectFieldChange('liveUrl', e.target.value)}
                      onBlur={() => handleProjectFieldBlur('liveUrl')}
                      placeholder="https://..."
                      className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                        projectTouched.liveUrl && projectErrors.liveUrl
                          ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                          : 'border-white/15 focus:border-cyan-400'
                      }`}
                    />
                    {projectTouched.liveUrl && projectErrors.liveUrl && (
                      <p className="text-rose-400 text-[10px] font-mono pt-1">
                        {projectErrors.liveUrl}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">GITHUB REPO URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => handleProjectFieldChange('githubUrl', e.target.value)}
                      onBlur={() => handleProjectFieldBlur('githubUrl')}
                      placeholder="https://github.com/..."
                      className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none transition-all ${
                        projectTouched.githubUrl && projectErrors.githubUrl
                          ? 'border-rose-500/60 bg-rose-950/10 focus:border-rose-500'
                          : 'border-white/15 focus:border-cyan-400'
                      }`}
                    />
                    {projectTouched.githubUrl && projectErrors.githubUrl && (
                      <p className="text-rose-400 text-[10px] font-mono pt-1">
                        {projectErrors.githubUrl}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>

                  <NeonButton type="submit" size="sm" variant="primary">
                    {editingProject ? 'Save Changes' : 'Deploy Project'}
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

export default AdminDashboard;
