import axiosInstance from '../api/axiosInstance.js';
import { ENDPOINTS } from '../api/endpoints.js';

/**
 * AI Assistant Service for Interactive Portfolio Terminal
 * Interfaces with the backend AI service with an intelligent local heuristic core fallback.
 */

const FALLBACK_KNOWLEDGE = {
  about: `Usama Ikram is a Frontend Web Developer and Architect based in Lahore, Pakistan. He specializes in React.js, Next.js, Tailwind CSS, and performance-first UI engineering. He is passionate about building clean, accessible, and high-framerate web applications.`,
  contact: `You can reach Usama directly at usama.code404@gmail.com or by phone/WhatsApp at +92 309 8525906. His GitHub profile is github.com/chusamaikram and LinkedIn is linkedin.com/in/usama-ikram-252052182.`,
  stack: `Usama's core tech stack comprises React 19, TypeScript, Tailwind CSS, Next.js, Vite, Three.js / React Three Fiber, Framer Motion, Zustand, and Axios with enterprise token interceptors.`,
  projects: {
    zeeframes: `ZeeFrames is a pixel-perfect replica of a modern creative design studio portfolio built to practice layout accuracy, micro-animations, and responsive breakpoints using React, Tailwind CSS, and Framer Motion.`,
    olyra: `Olyra is a modern health & wellness web application featuring interactive Echarts data visualizers, Zustand state management, and an accessible multi-view layout built with Next.js and Tailwind CSS.`,
    dentalook: `Dentalook is a specialized clinic web app with interactive charts visualizing patient flow, appointment records, and operational metrics with high performance.`,
    gmhs: `Govt High School Minchinabad website is a community-oriented educational portal with fast load times, semantic HTML5 structure, and full responsiveness.`,
    zapta: `ZAPTA Technologies replica focuses on complex layout grid precision, responsive form interactions, and subtle UI cues.`,
    weather: `WeatherMate is an API integration web app demonstrating clean Axios REST integration, geolocation-based caching, and responsive UI feedback.`,
  },
};

function generateIntelligentResponse(prompt, projectContext = null) {
  const p = prompt.toLowerCase();

  if (projectContext) {
    const key = Object.keys(FALLBACK_KNOWLEDGE.projects).find((k) =>
      projectContext.toLowerCase().includes(k)
    );
    if (key) {
      return `[TELEMETRY // PROJECT DEEP DIVE: ${projectContext.toUpperCase()}]\n\n${
        FALLBACK_KNOWLEDGE.projects[key]
      }\n\nKey Architectural Highlights:\n• Component-driven modular architecture\n• High-performance styling with Tailwind CSS\n• Sub-second layout hydration & zero CLS\n• Repository: https://github.com/chusamaikram`;
    }
  }

  if (p.includes('olyra')) {
    return `[OLYRA PLATFORM ARCHITECTURE]\n${FALLBACK_KNOWLEDGE.projects.olyra}\n\nLive Demo: https://olyra-v02.vercel.app/\nStack: Next.js, Tailwind, Echarts, Zustand`;
  }

  if (p.includes('dentalook')) {
    return `[DENTALOOK DASHBOARD TELEMETRY]\n${FALLBACK_KNOWLEDGE.projects.dentalook}\n\nLive Demo: https://dentalook-v2.vercel.app/\nStack: React.js, Echarts, Tailwind CSS`;
  }

  if (p.includes('zeeframes')) {
    return `[ZEEFRAMES STUDIO UI REPLICA]\n${FALLBACK_KNOWLEDGE.projects.zeeframes}\n\nLive Demo: https://zeeframes-v03.vercel.app/\nStack: React, Tailwind CSS, Framer Motion`;
  }

  if (p.includes('contact') || p.includes('hire') || p.includes('email') || p.includes('reach') || p.includes('phone')) {
    return `[COMMUNICATION CHANNELS OPEN]\n${FALLBACK_KNOWLEDGE.contact}\n\nStatus: Usama is currently AVAILABLE for freelance contracts and frontend engineering roles.`;
  }

  if (p.includes('skill') || p.includes('stack') || p.includes('tech') || p.includes('framework')) {
    return `[SYSTEM CAPABILITIES & TECH STACK]\n${FALLBACK_KNOWLEDGE.stack}\n\nArchitecture Patterns:\n• Modular atomic UI component design\n• Centralized Axios interceptors with seamless JWT refresh\n• Lazy-loaded 3D WebGL (Three.js / R3F) with 60FPS frame capping\n• Route protection middleware`;
  }

  if (p.includes('experience') || p.includes('background') || p.includes('who are you') || p.includes('about')) {
    return `[CORE PROFILE TELEMETRY]\n${FALLBACK_KNOWLEDGE.about}\n\nLocation: Lahore, Pakistan\nLanguages: English, Urdu\nMission: Transforming ideas into responsive, accessible, high-performance digital realities.`;
  }

  if (p.includes('project') || p.includes('work') || p.includes('portfolio')) {
    return `[CATALOGED PROJECTS HIGHLIGHT]\nUsama has engineered multiple production-ready web applications:\n1. Olyra (Health & Wellness with Echarts)\n2. Dentalook (Clinic Analytics Dashboard)\n3. ZeeFrames (Studio UX Replica)\n4. GMHS Minchinabad (Educational Platform)\n5. ZAPTA Contact Page (Precision UI)\n6. WeatherMate (Real-time REST API app)\n\nAsk me about any specific project to inspect its architecture!`;
  }

  return `[USAMA-AI CORE ONLINE]\nI'm ready to answer any questions about Usama Ikram's technical stack, architecture choices, projects (ZeeFrames, Olyra, Dentalook), or contact info.\n\nTry asking:\n• "Tell me about the Olyra project architecture"\n• "What is Usama's core tech stack?"\n• "How do I get in touch with Usama?"`;
}

export const aiService = {
  /**
   * Send prompt to AI chat service with intelligent offline fallback
   */
  async sendChatMessage(prompt, history = [], context = null) {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.CHAT, {
        prompt,
        history,
        context,
      });
      if (response.data?.reply || response.data?.message) {
        return {
          reply: response.data.reply || response.data.message,
          source: 'remote-ai-agent',
        };
      }
    } catch (error) {
      // Offline fallback
    }

    // Heuristic response generator
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reply: generateIntelligentResponse(prompt, context),
          source: 'local-heuristic-core',
        });
      }, 450);
    });
  },

  /**
   * Explain a specific project's architecture
   */
  async explainProject(projectTitle) {
    return this.sendChatMessage(
      `Please explain the architecture and design decisions for ${projectTitle}`,
      [],
      projectTitle
    );
  },
};

export default aiService;
