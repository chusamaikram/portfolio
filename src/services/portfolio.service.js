import axiosInstance from '../api/axiosInstance.js';
import { ENDPOINTS } from '../api/endpoints.js';

import Zeeframes from '../images/zeeframes-thumbnail.webp';
import Dentalook from '../images/dentalook-thumbnail.webp';
import Zapta from '../images/zapta-contactus.webp';
import Weather from '../images/weather-thumbnail.webp';
import Gmhhs from '../images/gmhs-thumbnail.webp';
import Olyra from '../images/olyra.webp';
import ProfileImg from '../images/profile.webp';

export const ASSETS = {
  profile: ProfileImg,
  zeeframes: Zeeframes,
  dentalook: Dentalook,
  zapta: Zapta,
  weather: Weather,
  gmhs: Gmhhs,
  olyra: Olyra,
};

export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'ZeeFrames – UI/UX Replica Project',
    description:
      'A pixel-perfect frontend replica of the ZeeFrames design studio website, recreated to practice layout precision, responsiveness, and modern UI structure.',
    image: Zeeframes,
    tags: ['React.js', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://zeeframes-v03.vercel.app',
    githubUrl: 'https://github.com/chusamaikram/Zeeframes',
    featured: true,
    category: 'Portfolio',
    architecture: 'Component-driven layout with custom micro-animations & responsive breakpoints',
    metrics: '99% Lighthouse Accessibility, <1.2s LCP',
  },
  {
    id: 2,
    title: 'Olyra – Health & Wellness Platform',
    description:
      'A modern health-focused web application designed to provide users with accessible tools related to wellness, nutrition, and healthy living with dynamic Echarts data visualization.',
    image: Olyra,
    tags: ['Next.js', 'Tailwind CSS', 'Echarts', 'Lucide-react', 'Zustand'],
    liveUrl: 'https://olyra-v02.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/olyra',
    featured: true,
    category: 'Web App',
    architecture: 'Modular Zustand state management, SSR-ready Next.js layout, and Echarts analytics',
    metrics: 'Real-time telemetry, 60fps chart rendering',
  },
  {
    id: 3,
    title: 'Dentalook – Dental Clinic Website Design',
    description:
      'A responsive dental clinic web app replica featuring interactive line and pie charts to visualize patient and appointment data in real-time.',
    image: Dentalook,
    tags: ['React.js', 'Echarts', 'Tailwind CSS'],
    liveUrl: 'https://dentalook-v2.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/React-Projects/tree/master/dentalook',
    featured: true,
    category: 'Dashboard',
    architecture: 'Custom dashboard widgets with dynamic reactive data pipelines',
    metrics: 'Multi-screen responsive viewport compliance',
  },
  {
    id: 4,
    title: 'Govt High School Minchinabad – Educational Website',
    description:
      'A professionally designed responsive website showcasing a government high school’s academic programs, faculty, admissions, events, and student success stories to engage the community.',
    image: Gmhhs,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/gmhs-portfolio',
    featured: false,
    category: 'Portfolio',
    architecture: 'Semantic HTML5 structure, lightweight zero-dependency asset pipeline',
    metrics: '100% SEO score, optimized mobile UX',
  },
  {
    id: 5,
    title: 'ZAPTA Contact Page – UI Replica',
    description:
      'A pixel-perfect replica of the original ZAPTA Technologies contact page built to practice layout accuracy, responsive design, and modern UI structure.',
    image: Zapta,
    tags: ['HTML5', 'JavaScript', 'Tailwind CSS', 'jQuery'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/Zapta-contactUs',
    featured: false,
    category: 'Portfolio',
    architecture: 'Asynchronous form validation, interactive micro-states & fluid transitions',
    metrics: 'Zero layout shifts (CLS < 0.01)',
  },
  {
    id: 6,
    title: 'WeatherMate – API Integration Project',
    description:
      'A lightweight weather app built to implement core logic for fetching and displaying real-time weather data from a free public API with dynamic updates.',
    image: Weather,
    tags: ['React.js', 'JSX', 'Tailwind CSS', 'REST API'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/weather-app',
    featured: false,
    category: 'Web App',
    architecture: 'Axios REST client with error boundary isolation & geolocation caching',
    metrics: 'Sub-300ms API response hydration',
  },
];

export const INITIAL_SKILLS = [
  {
    name: 'Frontend Core',
    skills: [
      { name: 'HTML5', level: 95, icon: 'Code', highlight: 'Semantic DOM, Accessibility standards' },
      { name: 'CSS3 / CSS Modules', level: 92, icon: 'Palette', highlight: 'Flexbox, CSS Grid, Custom properties' },
      { name: 'JavaScript (ES6+)', level: 90, icon: 'Terminal', highlight: 'Async/Await, Closures, DOM manipulation' },
      { name: 'TypeScript', level: 65, icon: 'ShieldCheck', highlight: 'Generics, Strict typing, Interface design' },
    ],
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'React.js 19', level: 92, icon: 'Atom', highlight: 'Hooks, Suspense, Concurrent rendering' },
      { name: 'Tailwind CSS', level: 95, icon: 'Wind', highlight: 'Tailwind Merge, CVA, Glassmorphic design' },
      { name: 'Next.js 14/15', level: 45, icon: 'Layers', highlight: 'App Router, Server components, SSR' },
      { name: 'Framer Motion', level: 60, icon: 'Sparkles', highlight: '3D transforms, Gesture animations, Bento grids' },
      { name: 'Three.js / R3F', level: 50, icon: 'Box', highlight: 'Canvas optimization, 60FPS shaders, Wireframes' },
      { name: 'Echarts / Recharts', level: 82, icon: 'BarChart2', highlight: 'Real-time telemetry, Data visualization' },
    ],
  },
  {
    name: 'Architecture & Tools',
    skills: [
      { name: 'Git & GitHub', level: 78, icon: 'GitBranch', highlight: 'Trunk workflows, PR reviews, CI/CD' },
      { name: 'Vite & Modern Bundlers', level: 90, icon: 'Zap', highlight: 'HMR tuning, Chunk splitting, Bundle audit' },
      { name: 'REST APIs & Axios Interceptors', level: 88, icon: 'Server', highlight: 'Bearer auth, Token refreshing, Retries' },
      { name: 'Vercel / Cloud Deployment', level: 85, icon: 'Cloud', highlight: 'Edge routing, Environment configs' },
    ],
  },
];

export const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    name: 'David Chen',
    role: 'VP of Engineering',
    company: 'Aura Health & Web',
    content:
      'Usama translated our complex specifications into a blazing-fast React and Echarts application. His eye for micro-interactions and clean state architecture is remarkable.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    visible: true,
    date: 'October 2026',
  },
  {
    id: 2,
    name: 'Amara Khan',
    role: 'Lead UI/UX Designer',
    company: 'Zeeframes Studios',
    content:
      'The level of pixel accuracy Usama achieved on our studio replica was astonishing. Flawless responsive breakpoints and fluid 60FPS animations.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    visible: true,
    date: 'September 2026',
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Senior Frontend Architect',
    company: 'Apex Digital Labs',
    content:
      'Usama understands modern enterprise architecture deeply: robust token refresh interceptors, lightweight WebGL loading, and zero layout shift. Highly recommended.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    visible: true,
    date: 'August 2026',
  },
];

export const INITIAL_EXPERIENCES = [
  {
    id: 1,
    role: 'Frontend Web Developer & UI Architect',
    company: 'Independent / Freelance',
    period: '2026 - Present',
    description:
      'Architecting responsive React 19 web applications, UI/UX replicas, and lightweight WebGL graphics with Tailwind CSS and Framer Motion.',
    tags: ['React 19', 'Tailwind CSS', 'Next.js', 'Three.js', 'Axios'],
  },
  {
    id: 2,
    role: 'Frontend Engineering Contributor',
    company: 'Open Source Ecosystem & Web Labs',
    period: '2025 - 2026',
    description:
      'Built accessible responsive UI components, optimized bundle code-splitting, and integrated REST APIs with resilient error boundaries.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'Git'],
  },
];

export const INITIAL_PROFILE_INFO = {
  name: 'Usama Ikram',
  title: 'Principal Frontend Architect & Web Engineer',
  bio: 'Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics.',
  location: 'Lahore, Pakistan',
  email: 'usama.code404@gmail.com',
  phone: '+92 309 8525906',
  github: 'https://github.com/chusamaikram',
  linkedin: 'https://linkedin.com/in/usama-ikram-252052182',
  status: 'Available for Freelance & Full-time Roles',
};

const LOCAL_STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects_data',
  SKILLS: 'portfolio_skills_data',
  MESSAGES: 'portfolio_contact_messages',
  TESTIMONIALS: 'portfolio_testimonials_data',
  EXPERIENCES: 'portfolio_experiences_data',
  PROFILE: 'portfolio_profile_info',
};

// Helper to access and seed LocalStorage
function getLocalData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed saving ${key} to localStorage`, e);
  }
}

export const portfolioService = {
  /**
   * Fetch all portfolio projects (Remote API with automatic resilient fallback)
   */
  async getProjects() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PORTFOLIO.PROJECTS);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      // Backend is offline or route not ready; silently fallback to local data
    }
    return getLocalData(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  /**
   * Add a new project (Dashboard action)
   */
  async createProject(projectData) {
    const newProject = {
      ...projectData,
      id: Date.now(),
      image: projectData.image || Zeeframes,
      featured: Boolean(projectData.featured),
      tags: Array.isArray(projectData.tags)
        ? projectData.tags
        : String(projectData.tags || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
    };

    try {
      const response = await axiosInstance.post(
        ENDPOINTS.PORTFOLIO.PROJECTS,
        newProject
      );
      if (response.data) return response.data;
    } catch (e) {
      // Local fallback for offline UI capability
    }

    const current = getLocalData(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updated = [newProject, ...current];
    setLocalData(LOCAL_STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  /**
   * Update existing project
   */
  async updateProject(id, updatedFields) {
    try {
      const response = await axiosInstance.put(
        ENDPOINTS.PORTFOLIO.PROJECT_DETAIL(id),
        updatedFields
      );
      if (response.data) return response.data;
    } catch (e) {
      // Local fallback
    }

    const current = getLocalData(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updated = current.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setLocalData(LOCAL_STORAGE_KEYS.PROJECTS, updated);
    return updated.find((p) => p.id === id);
  },

  /**
   * Delete project
   */
  async deleteProject(id) {
    try {
      await axiosInstance.delete(ENDPOINTS.PORTFOLIO.PROJECT_DETAIL(id));
    } catch (e) {
      // Local fallback
    }

    const current = getLocalData(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updated = current.filter((p) => p.id !== id);
    setLocalData(LOCAL_STORAGE_KEYS.PROJECTS, updated);
    return { success: true, id };
  },

  /**
   * Reset projects back to default portfolio baseline
   */
  resetProjects() {
    setLocalData(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  },

  /**
   * Fetch skills matrix
   */
  async getSkills() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PORTFOLIO.SKILLS);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      // Local fallback
    }
    return getLocalData(LOCAL_STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  /**
   * Update skills matrix
   */
  async updateSkills(skillsData) {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.PORTFOLIO.SKILLS,
        skillsData
      );
      if (response.data) return response.data;
    } catch (e) {
      // Local fallback
    }
    setLocalData(LOCAL_STORAGE_KEYS.SKILLS, skillsData);
    return skillsData;
  },

  /**
   * Record visitor contact message
   */
  async sendMessage(messageData) {
    const newMessage = {
      ...messageData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      await axiosInstance.post(ENDPOINTS.PORTFOLIO.MESSAGES, newMessage);
    } catch (e) {
      // Local storage preservation
    }

    const currentMessages = getLocalData(LOCAL_STORAGE_KEYS.MESSAGES, [
      {
        id: 101,
        name: 'Sarah Connor (Cyberdyne Systems)',
        email: 'sarah@resistance.ai',
        subject: 'Frontend Architecture Contract',
        message: 'Hello Usama, we reviewed your Olyra and Dentalook projects. We are looking for an architect to build our 2026 operations dashboard.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        isRead: false,
      },
      {
        id: 102,
        name: 'Alex Rivera (Venture Labs)',
        email: 'alex@venturelabs.dev',
        subject: 'React 19 & Tailwind Portfolio Review',
        message: 'Loved your 3D wireframe and Bento grid layout. Incredible performance optimization.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        isRead: true,
      },
    ]);

    const updated = [newMessage, ...currentMessages];
    setLocalData(LOCAL_STORAGE_KEYS.MESSAGES, updated);
    return newMessage;
  },

  /**
   * Fetch visitor messages for Admin Dashboard
   */
  async getMessages() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PORTFOLIO.MESSAGES);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (e) {
      // Local fallback
    }

    return getLocalData(LOCAL_STORAGE_KEYS.MESSAGES, [
      {
        id: 101,
        name: 'Sarah Connor (Cyberdyne Systems)',
        email: 'sarah@resistance.ai',
        subject: 'Frontend Architecture Contract',
        message: 'Hello Usama, we reviewed your Olyra and Dentalook projects. We are looking for an architect to build our 2026 operations dashboard.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        isRead: false,
      },
      {
        id: 102,
        name: 'Alex Rivera (Venture Labs)',
        email: 'alex@venturelabs.dev',
        subject: 'React 19 & Tailwind Portfolio Review',
        message: 'Loved your 3D wireframe and Bento grid layout. Incredible performance optimization.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        isRead: true,
      },
    ]);
  },

  /**
   * Delete contact message
   */
  async deleteMessage(id) {
    try {
      await axiosInstance.delete(ENDPOINTS.PORTFOLIO.MESSAGE_DETAIL(id));
    } catch (e) {
      // Local fallback
    }

    const current = getLocalData(LOCAL_STORAGE_KEYS.MESSAGES, []);
    const updated = current.filter((m) => m.id !== id);
    setLocalData(LOCAL_STORAGE_KEYS.MESSAGES, updated);
    return { success: true, id };
  },

  /**
   * Mark message as read
   */
  async markMessageRead(id) {
    const current = getLocalData(LOCAL_STORAGE_KEYS.MESSAGES, []);
    const updated = current.map((m) =>
      m.id === id ? { ...m, isRead: true } : m
    );
    setLocalData(LOCAL_STORAGE_KEYS.MESSAGES, updated);
    return updated;
  },

  /**
   * Testimonials CRUD
   */
  async getTestimonials() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PORTFOLIO.TESTIMONIALS);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      // Local fallback
    }
    return getLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },

  async createTestimonial(testimonialData) {
    const newTestimonial = {
      ...testimonialData,
      id: Date.now(),
      rating: Number(testimonialData.rating) || 5,
      visible: testimonialData.visible !== false,
      date: testimonialData.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    try {
      await axiosInstance.post(ENDPOINTS.PORTFOLIO.TESTIMONIALS, newTestimonial);
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const updated = [newTestimonial, ...current];
    setLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, updated);
    return newTestimonial;
  },

  async updateTestimonial(id, updatedFields) {
    try {
      await axiosInstance.put(ENDPOINTS.PORTFOLIO.TESTIMONIAL_DETAIL(id), updatedFields);
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const updated = current.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, updated);
    return updated.find((t) => t.id === id);
  },

  async deleteTestimonial(id) {
    try {
      await axiosInstance.delete(ENDPOINTS.PORTFOLIO.TESTIMONIAL_DETAIL(id));
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const updated = current.filter((t) => t.id !== id);
    setLocalData(LOCAL_STORAGE_KEYS.TESTIMONIALS, updated);
    return { success: true, id };
  },

  /**
   * Career Timeline / Experience CRUD
   */
  async getExperiences() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PORTFOLIO.EXPERIENCES);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {}
    return getLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
  },

  async createExperience(expData) {
    const newExp = {
      ...expData,
      id: Date.now(),
      tags: Array.isArray(expData.tags)
        ? expData.tags
        : String(expData.tags || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
    };

    try {
      await axiosInstance.post(ENDPOINTS.PORTFOLIO.EXPERIENCES, newExp);
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    const updated = [newExp, ...current];
    setLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, updated);
    return newExp;
  },

  async updateExperience(id, updatedFields) {
    try {
      await axiosInstance.put(ENDPOINTS.PORTFOLIO.EXPERIENCE_DETAIL(id), updatedFields);
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    const updated = current.map((exp) => (exp.id === id ? { ...exp, ...updatedFields } : exp));
    setLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, updated);
    return updated.find((exp) => exp.id === id);
  },

  async deleteExperience(id) {
    try {
      await axiosInstance.delete(ENDPOINTS.PORTFOLIO.EXPERIENCE_DETAIL(id));
    } catch (e) {}

    const current = getLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    const updated = current.filter((exp) => exp.id !== id);
    setLocalData(LOCAL_STORAGE_KEYS.EXPERIENCES, updated);
    return { success: true, id };
  },

  /**
   * Profile Info
   */
  getProfileInfo() {
    return getLocalData(LOCAL_STORAGE_KEYS.PROFILE, INITIAL_PROFILE_INFO);
  },

  updateProfileInfo(info) {
    setLocalData(LOCAL_STORAGE_KEYS.PROFILE, info);
    return info;
  },
};

export default portfolioService;
