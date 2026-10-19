import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Key,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Cpu,
  Layers,
  Sliders,
  SlidersHorizontal,
  Activity,
  Send,
  HelpCircle,
  Database,
  Trash2,
  Server,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import aiService from '../../../services/ai.service.js';

const PROVIDER_METADATA = {
  gemini: {
    name: 'Google Gemini',
    description: 'High-speed reasoning via the official google-genai SDK',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    badge: 'Official SDK',
    color: 'from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400',
    keyPlaceholder: 'AIzaSy...',
  },
  groq: {
    name: 'Groq Cloud',
    description: 'Ultra-fast inference powered by LPU hardware (Llama 3.3)',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    badge: 'Ultra Fast',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    keyPlaceholder: 'gsk_...',
  },
  openai: {
    name: 'OpenAI',
    description: 'Industry standard GPT models (GPT-4o / GPT-4o-mini)',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    badge: 'Standard',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    keyPlaceholder: 'sk-proj-...',
  },
};

export const AISettingsView = () => {
  const [settings, setSettings] = useState({
    primary_provider: 'gemini',
    primary_model: 'gemini-2.5-flash',
    primary_api_key: '',
    fallback_provider: 'groq',
    fallback_model: 'llama-3.3-70b-versatile',
    fallback_api_key: '',
    temperature: 0.7,
    system_instruction_extra: '',
    is_active: true,
    knowledge_version: 1,
    enable_cache: true,
    cache_stats: {
      total_cached_queries: 0,
      total_requests_served: 0,
      api_calls_saved: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [showPrimaryKey, setShowPrimaryKey] = useState(false);
  const [showFallbackKey, setShowFallbackKey] = useState(false);

  // Healthcheck state
  const [healthInfo, setHealthInfo] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Testing states
  const [primaryTestState, setPrimaryTestState] = useState({ status: 'idle', latency: null, message: '' });
  const [fallbackTestState, setFallbackTestState] = useState({ status: 'idle', latency: null, message: '' });

  // Quick Chat Playground
  const [playgroundInput, setPlaygroundInput] = useState('What skills does Usama have?');
  const [playgroundReply, setPlaygroundReply] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadSettings();
    probeHealth();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.getSettings();
      setSettings(data);
    } catch {
      toast.error('Failed to load AI settings');
    } finally {
      setIsLoading(false);
    }
  };

  const probeHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await aiService.checkHealth();
      setHealthInfo(res);
    } catch {
      setHealthInfo({ status: 'offline' });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await aiService.updateSettings(settings);
      setSettings(updated);
      toast.success('AI Integration settings saved successfully!', {
        description: `Primary: ${updated.primary_provider.toUpperCase()} | Fallback: ${updated.fallback_provider.toUpperCase()}`,
      });
    } catch {
      toast.error('Failed to update AI settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFlushCache = async () => {
    if (!window.confirm('Flush all cached AI responses? Next duplicate queries will call the AI provider.')) return;
    setIsFlushingCache(true);
    try {
      const res = await aiService.flushCache();
      toast.success(`Semantic Cache Cleared! Flushed ${res.flushed_count || 0} stored responses.`);
      loadSettings();
    } catch {
      toast.error('Failed to flush cache');
    } finally {
      setIsFlushingCache(false);
    }
  };

  const handleTestPrimary = async () => {
    setPrimaryTestState({ status: 'loading', latency: null, message: 'Pinging primary provider...' });
    try {
      const res = await aiService.testConnection({
        provider: settings.primary_provider,
        api_key: settings.primary_api_key,
        model: settings.primary_model,
      });
      setPrimaryTestState({
        status: 'success',
        latency: res.latency_ms,
        message: `Success! Latency: ${res.latency_ms}ms (${res.provider})`,
      });
      toast.success(`Connected to ${res.provider.toUpperCase()}! Response time: ${res.latency_ms}ms`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Connection failed';
      setPrimaryTestState({ status: 'error', latency: null, message: errMsg });
      toast.error(`Primary Test Failed: ${errMsg}`);
    }
  };

  const handleTestFallback = async () => {
    if (settings.fallback_provider === 'none') return;
    setFallbackTestState({ status: 'loading', latency: null, message: 'Pinging fallback provider...' });
    try {
      const res = await aiService.testConnection({
        provider: settings.fallback_provider,
        api_key: settings.fallback_api_key,
        model: settings.fallback_model,
      });
      setFallbackTestState({
        status: 'success',
        latency: res.latency_ms,
        message: `Success! Latency: ${res.latency_ms}ms (${res.provider})`,
      });
      toast.success(`Connected to Fallback (${res.provider.toUpperCase()})! ${res.latency_ms}ms`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Connection failed';
      setFallbackTestState({ status: 'error', latency: null, message: errMsg });
      toast.error(`Fallback Test Failed: ${errMsg}`);
    }
  };

  const handleRunPlayground = async () => {
    if (!playgroundInput.trim()) return;
    setIsPlaying(true);
    setPlaygroundReply(null);
    try {
      const res = await aiService.sendMessage(playgroundInput);
      setPlaygroundReply(res);
      if (res.is_cached) {
        toast.success(`Served instantly from Semantic Cache! (Hit #${res.hit_count})`);
      } else {
        toast.success(`Inference returned via ${res.provider || 'AI'}`);
      }
      loadSettings(); // update cache metrics
    } catch {
      toast.error('Playground chat execution failed');
    } finally {
      setIsPlaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-cyan-400 font-mono text-xs">
        <RefreshCw className="w-8 h-8 animate-spin mb-3" />
        <span>LOADING AI ASSISTANT CONFIGURATION...</span>
      </div>
    );
  }

  const backendHost = window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900/60 p-6 md:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Multi-Provider AI Intelligence
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono">
                <Database className="w-3 h-3" />
                Knowledge: v{settings.knowledge_version || 1} (Live Synced)
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              AI Assistant, Continuous Learning & Failover Engine
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Dynamically learns whenever you update projects, skills, or testimonials. Equipped with semantic question caching to eliminate API quota exhaustion on repeated inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80">
              <span className="text-xs font-mono text-slate-400">Global AI Status:</span>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, is_active: !prev.is_active }))}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  settings.is_active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {settings.is_active ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render / Cloud Hosting Keepalive Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Production Keepalive & Healthcheck Route</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {healthInfo?.status === 'healthy' ? '200 OK (DB Connected)' : 'Checking...'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Use <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">/health/</code> or <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">/api/v1/health/</code> on Render, UptimeRobot, or Cron-job.org to prevent backend spin-down.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${backendHost}/health/`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-cyan-300 transition-all"
          >
            <span>Open /health/</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={probeHealth}
            disabled={isCheckingHealth}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Semantic Question Cache & Anti-Quota Exhaustion Section */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Semantic Cache & Anti-Quota Exhaustion</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Zero Token Burn
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Intercepts repeated and rephrased visitor inquiries locally, returning instant responses and protecting your API credits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
              <input
                type="checkbox"
                checked={settings.enable_cache}
                onChange={(e) => setSettings((prev) => ({ ...prev, enable_cache: e.target.checked }))}
                className="accent-cyan-400 rounded w-4 h-4 cursor-pointer"
              />
              <span>Enable Cache</span>
            </label>

            <button
              type="button"
              onClick={handleFlushCache}
              disabled={isFlushingCache}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Flush Cache</span>
            </button>
          </div>
        </div>

        {/* Cache Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Cached Question Pairs</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {settings.cache_stats?.total_cached_queries || 0}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Unique normalized questions</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">API Calls Saved</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {settings.cache_stats?.api_calls_saved || 0}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Quota tokens preserved</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Active Knowledge Version</span>
            <div className="text-2xl font-bold font-mono text-purple-400">
              v{settings.knowledge_version || 1}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Auto-bumps on CMS updates</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Primary AI Provider */}
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Primary AI Provider</h3>
                <p className="text-xs text-slate-400">First-line intelligence engine for visitor inquiries</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestPrimary}
              disabled={primaryTestState.status === 'loading'}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition-all disabled:opacity-50"
            >
              {primaryTestState.status === 'loading' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          {/* Provider Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PROVIDER_METADATA).map(([key, meta]) => {
              const isSelected = settings.primary_provider === key;
              return (
                <div
                  key={key}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      primary_provider: key,
                      primary_model: meta.defaultModel,
                    }))
                  }
                  className={`cursor-pointer relative rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? `bg-gradient-to-br ${meta.color} shadow-lg shadow-cyan-950/30`
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{meta.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300">
                      {meta.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{meta.description}</p>
                </div>
              );
            })}
          </div>

          {/* Model and API Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>MODEL IDENTIFIER</span>
                <span className="text-slate-500 text-[10px]">Select preset or enter custom</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.primary_model}
                  onChange={(e) => setSettings((prev) => ({ ...prev, primary_model: e.target.value }))}
                  placeholder={PROVIDER_METADATA[settings.primary_provider]?.defaultModel}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PROVIDER_METADATA[settings.primary_provider]?.models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, primary_model: m }))}
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-all ${
                      settings.primary_model === m
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>PRIMARY API KEY</span>
                <span className="text-slate-500 text-[10px]">Saved securely in DB</span>
              </label>
              <div className="relative">
                <input
                  type={showPrimaryKey ? 'text' : 'password'}
                  value={settings.primary_api_key}
                  onChange={(e) => setSettings((prev) => ({ ...prev, primary_api_key: e.target.value }))}
                  placeholder={PROVIDER_METADATA[settings.primary_provider]?.keyPlaceholder}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPrimaryKey(!showPrimaryKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPrimaryKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {primaryTestState.message && (
                <div
                  className={`text-xs font-mono flex items-center gap-1.5 pt-1 ${
                    primaryTestState.status === 'success'
                      ? 'text-emerald-400'
                      : primaryTestState.status === 'error'
                      ? 'text-rose-400'
                      : 'text-cyan-400'
                  }`}
                >
                  {primaryTestState.status === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{primaryTestState.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Fallback Provider (Failover Engine) */}
        <div className="rounded-2xl border border-purple-500/20 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Resilient Failover & Fallback Provider</h3>
                <p className="text-xs text-slate-400">Automatically activates if primary engine exhausts rate limits or times out</p>
              </div>
            </div>

            {settings.fallback_provider !== 'none' && (
              <button
                type="button"
                onClick={handleTestFallback}
                disabled={fallbackTestState.status === 'loading'}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-mono transition-all disabled:opacity-50"
              >
                {fallbackTestState.status === 'loading' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Activity className="w-3.5 h-3.5" />
                )}
                <span>Test Fallback</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              onClick={() => setSettings((prev) => ({ ...prev, fallback_provider: 'none' }))}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                settings.fallback_provider === 'none'
                  ? 'border-slate-500 bg-slate-800/60 text-white'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-sm">None</div>
              <p className="text-xs text-slate-500 mt-1">No secondary failover</p>
            </div>

            {Object.entries(PROVIDER_METADATA).map(([key, meta]) => {
              const isSelected = settings.fallback_provider === key;
              return (
                <div
                  key={key}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      fallback_provider: key,
                      fallback_model: meta.defaultModel,
                    }))
                  }
                  className={`cursor-pointer relative rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? `bg-gradient-to-br ${meta.color} shadow-lg shadow-purple-950/30`
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{meta.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300">
                      Fallback
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{meta.defaultModel}</p>
                </div>
              );
            })}
          </div>

          {settings.fallback_provider !== 'none' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">FALLBACK MODEL IDENTIFIER</label>
                <input
                  type="text"
                  value={settings.fallback_model}
                  onChange={(e) => setSettings((prev) => ({ ...prev, fallback_model: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>FALLBACK API KEY</span>
                  <span className="text-slate-500 text-[10px]">Encrypted at rest</span>
                </label>
                <div className="relative">
                  <input
                    type={showFallbackKey ? 'text' : 'password'}
                    value={settings.fallback_api_key}
                    onChange={(e) => setSettings((prev) => ({ ...prev, fallback_api_key: e.target.value }))}
                    placeholder="Enter secondary provider API key..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFallbackKey(!showFallbackKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showFallbackKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fallbackTestState.message && (
                  <div
                    className={`text-xs font-mono flex items-center gap-1.5 pt-1 ${
                      fallbackTestState.status === 'success'
                        ? 'text-emerald-400'
                        : fallbackTestState.status === 'error'
                        ? 'text-rose-400'
                        : 'text-purple-400'
                    }`}
                  >
                    {fallbackTestState.status === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{fallbackTestState.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Hyperparameters & Prompt Instruction */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Inference Tuning & Tone</h3>
              <p className="text-xs text-slate-400">Control temperature sampling and persona instructions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">TEMPERATURE</span>
                <span className="text-cyan-400 font-bold">{settings.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => setSettings((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0 Precise</span>
                <span>0.7 Balanced</span>
                <span>1.0 Creative</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-mono text-slate-300">CUSTOM SYSTEM INSTRUCTION APPEND (OPTIONAL)</label>
              <textarea
                rows={3}
                value={settings.system_instruction_extra || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, system_instruction_extra: e.target.value }))}
                placeholder="e.g. Always emphasize Usama's availability for full-time frontend engineering roles and mention his 99% Lighthouse performance scores..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-sm font-semibold tracking-wide shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>SAVE AI CONFIGURATION</span>
          </button>
        </div>
      </form>

      {/* Section 4: Live Verification Sandbox */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-md font-semibold text-white">Live Verification Sandbox</h3>
          <span className="text-xs text-slate-500 font-mono">Test duplicate question caching and live inference</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={playgroundInput}
            onChange={(e) => setPlaygroundInput(e.target.value)}
            placeholder="Ask anything about Usama's projects, architecture, or skills..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleRunPlayground}
            disabled={isPlaying || !playgroundInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-all disabled:opacity-50"
          >
            {isPlaying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Test</span>
          </button>
        </div>

        {playgroundReply && (
          <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-semibold">
                Provider: {playgroundReply.provider} {playgroundReply.model ? `(${playgroundReply.model})` : ''}
              </span>
              <span className={playgroundReply.is_cached ? 'text-emerald-400' : playgroundReply.is_fallback ? 'text-amber-400' : 'text-cyan-400'}>
                {playgroundReply.is_cached
                  ? `⚡ SERVED FROM SEMANTIC CACHE (HIT #${playgroundReply.hit_count || 1} - 0 TOKENS)`
                  : playgroundReply.is_fallback
                  ? '⚡ SERVED VIA FALLBACK'
                  : '✓ PRIMARY PROVIDER'}
              </span>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {playgroundReply.reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISettingsView;
