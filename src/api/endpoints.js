/**
 * Centralized API endpoints registry for Enterprise Portfolio Architecture
 * All routes are versioned under /api/v1/
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  PORTFOLIO: {
    BASE: '/api/v1/portfolio/',
    PROJECTS: '/api/v1/portfolio/projects/',
    PROJECT_DETAIL: (id) => `/api/v1/portfolio/projects/${id}/`,
    SKILLS: '/api/v1/portfolio/skills/',
    TESTIMONIALS: '/api/v1/portfolio/testimonials/',
    TESTIMONIAL_DETAIL: (id) => `/api/v1/portfolio/testimonials/${id}/`,
    EXPERIENCES: '/api/v1/portfolio/experiences/',
    EXPERIENCE_DETAIL: (id) => `/api/v1/portfolio/experiences/${id}/`,
    MESSAGES: '/api/v1/portfolio/messages/',
    MESSAGE_DETAIL: (id) => `/api/v1/portfolio/messages/${id}/`,
    PROFILE: '/api/v1/portfolio/profile/',
    TELEMETRY: '/api/v1/portfolio/telemetry/',
  },
  AUTH: {
    LOGIN: '/api/v1/auth/login/',
    REFRESH: '/api/v1/auth/refresh/',
    LOGOUT: '/api/v1/auth/logout/',
    ME: '/api/v1/auth/me/',
  },
  AI: {
    CHAT: '/api/v1/ai/chat/',
    SETTINGS: '/api/v1/ai/settings/',
    TEST: '/api/v1/ai/test/',
    CACHE_FLUSH: '/api/v1/ai/cache/flush/',
    CACHE_STATS: '/api/v1/ai/cache/stats/',
    COPILOT_GENERATE: '/api/v1/ai/copilot/generate/',
    INBOX_ANALYSIS: '/api/v1/ai/copilot/inbox-analysis/',
    DRAFT_REPLY: '/api/v1/ai/copilot/draft-reply/',
    EXPLAIN_PROJECT: '/api/v1/ai/explain-project/',
    GENERATE_SUMMARY: '/api/v1/ai/generate-summary/',
  },
  SYSTEM: {
    HEALTH: '/api/v1/health/',
    ROOT_HEALTH: '/health/',
  },
};

export default ENDPOINTS;
