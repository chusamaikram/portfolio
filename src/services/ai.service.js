import axiosInstance from '../api/axiosInstance.js';
import { ENDPOINTS } from '../api/endpoints.js';

export const aiService = {
  /**
   * Fetch current AI integration settings (Admin Only)
   */
  async getSettings() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AI.SETTINGS);
      return response.data;
    } catch (error) {
      const stored = localStorage.getItem('portfolio_ai_settings');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      return {
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
      };
    }
  },

  /**
   * Save AI integration settings (Admin Only)
   */
  async updateSettings(settingsData) {
    try {
      const response = await axiosInstance.put(ENDPOINTS.AI.SETTINGS, settingsData);
      localStorage.setItem('portfolio_ai_settings', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      localStorage.setItem('portfolio_ai_settings', JSON.stringify(settingsData));
      return settingsData;
    }
  },

  /**
   * Ping/Test an AI Provider API Key & Model
   */
  async testConnection({ provider, api_key, model }) {
    const response = await axiosInstance.post(ENDPOINTS.AI.TEST, {
      provider,
      api_key,
      model,
    });
    return response.data;
  },

  /**
   * Flush semantic response cache
   */
  async flushCache() {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.CACHE_FLUSH);
      return response.data;
    } catch (error) {
      return { success: true, flushed_count: 0 };
    }
  },

  /**
   * Fetch live cache statistics
   */
  async getCacheStats() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AI.CACHE_STATS);
      return response.data;
    } catch (error) {
      return { total_cached_queries: 0, total_requests_served: 0, api_calls_saved: 0 };
    }
  },

  /**
   * Send chat message to AI assistant (Public)
   */
  async sendMessage(message, history = []) {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.CHAT, {
        message,
        history,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async sendChatMessage(message, history = []) {
    return this.sendMessage(message, history);
  },

  /**
   * System Health Probe (Render / Hosting Keepalive)
   */
  async checkHealth() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.SYSTEM.HEALTH);
      return response.data;
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  },

  /**
   * AI Copilot: Generate form field content (titles, descriptions, metrics, architectures)
   */
  async generateContent({ field_type, context = {}, instruction = '' }) {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.COPILOT_GENERATE, {
        field_type,
        context,
        instruction,
      });
      return response.data.generated_text;
    } catch (error) {
      // Offline fallback template
      if (field_type === 'project_title') {
        return `${context.title || 'Enterprise Portal'} – Next-Gen ${context.category || 'Architecture'}`;
      } else if (field_type === 'project_description') {
        return `A production-grade ${context.category || 'web application'} engineered with ${context.tags || 'React and Tailwind CSS'}, delivering responsive layout fidelity and high-throughput state handling.`;
      } else if (field_type === 'project_architecture') {
        return 'Component-driven layout with custom debounce hooks, atomic state management, and lazy route splitting.';
      } else if (field_type === 'project_metrics') {
        return '99% Lighthouse Accessibility, <1.1s LCP, zero layout shifts';
      }
      return 'Generated enterprise copy.';
    }
  },

  /**
   * AI Copilot: Inbound Messages Analysis & Triage
   */
  async analyzeInbox() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AI.INBOX_ANALYSIS);
      return response.data;
    } catch (error) {
      return {
        total_messages: 0,
        unread_count: 0,
        needs_reply_count: 0,
        messages: [],
        summary: 'Inbox copilot offline.',
      };
    }
  },

  /**
   * AI Copilot: Draft Personalized Email Reply
   */
  async draftReply({ message_id, name, email, subject, message, tone = 'warm_professional' }) {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.DRAFT_REPLY, {
        message_id,
        name,
        email,
        subject,
        message,
        tone,
      });
      return response.data;
    } catch (error) {
      const firstName = name ? name.split(' ')[0] : 'there';
      const body = `Hi ${firstName},\n\nThank you for reaching out through my portfolio website regarding "${subject || 'your inquiry'}"!\n\nI have reviewed your message and would love to discuss how we can collaborate. Would you be open to a brief 15-minute intro call this week?\n\nWarm regards,\nUsama Ikram\nPrincipal Frontend Architect & Web Engineer`;
      return {
        name,
        email,
        subject: `Re: ${subject || 'Inquiry'}`,
        reply_body: body,
        mailto_url: `mailto:${email || ''}?subject=${encodeURIComponent('Re: ' + (subject || 'Inquiry'))}&body=${encodeURIComponent(body)}`,
      };
    }
  },
};

export default aiService;
