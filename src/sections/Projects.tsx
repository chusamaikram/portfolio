import { useState } from 'react';
import { Github } from 'lucide-react';
import { Button } from '../components/ui/button';

import Zeeframes from "../images/zeeframes-thumbnail.webp"
import Dentalook from "../images/dentalook-thumbnail.webp"
import Zapta from "../images/zapta-contactus.webp"
import Weather from "../images/weather-thumbnail.webp"
import Gmhhs from "../images/gmhs-thumbnail.webp"
import Olyra from "../images/olyra.webp"
import ProjectCard from '../components/ui/ProjectCard';

const projects = [
  {
    id: 1,
    title: 'ZeeFrames – UI/UX Replica Project',
    description: 'A pixel-perfect frontend replica of the ZeeFrames design studio website, recreated to practice layout precision, responsiveness, and modern UI structure.',
    image: Zeeframes,
    tags: ['React.js', 'javascript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://zeeframes-v03.vercel.app',
    githubUrl: 'https://github.com/chusamaikram/Zeeframes',
    featured: true,
    category: 'Portfolio',
  },
  {
    id: 2,
    title: 'Olyra – Health & Wellness Platform',
    description: 'Olyra is a modern health-focused web application designed to provide users with accessible information and tools related to wellness, nutrition, and healthy living. The project focuses on delivering a clean user interface and fast performance while presenting health-related content in an engaging and organized way.',
    image: Olyra,
    tags: ['Next.js', 'Tailwind Css', 'Echarts', 'Lucide-react', 'Zustand'],
    liveUrl: 'https://olyra-v02.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/olyra',
    featured: true,
    category: 'Web App',
  },
  {
    id: 3,
    title: 'Dentalook – Dental Clinic Website Design',
    description: 'A responsive dental clinic web app replica featuring interactive line and pie charts to visualize patient and appointment data.',
    image: Dentalook,
    tags: ['React.js', 'Echarts', 'Tailwind CSS'],
    liveUrl: 'https://dentalook-v2.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/React-Projects/tree/master/dentalook',
    featured: true,
    category: 'Dashboard',
  },
  {
    id: 4,
    title: 'Govt High School Minchinabad – Educational Website',
    description: 'A professionally designed responsive website showcasing a government high school’s academic programs, faculty, admissions, events, and student success stories to engage the community.',
    image: Gmhhs,
    tags: ['Html5', 'Css3', 'Javascript', 'Tailwind CSS'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/gmhs-portfolio',
    featured: false,
    category: 'Portfolio',
  },
  {
    id: 5,
    title: 'ZAPTA Contact Page – UI Replica ',
    description: 'A pixel-perfect replica of the original ZAPTA Technologies contact page built to practice layout accuracy, responsive design, and modern UI structure.',
    image: Zapta,
    tags: ['Html5', 'Javascript', 'Codepen', 'Tailwind Css', 'Jquery'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/Zapta-contactUs',
    featured: false,
    category: 'Portfolio',
  },
  {
    id: 6,
    title: 'WeatherMate – API Integration Project',
    description: 'A lightweight weather app built to implement core logic for fetching and displaying real-time weather data from a free public API. Focused on handling API requests, data parsing, and dynamic updates rather than detailed UI design.',
    image: Weather,
    tags: ['React.js', 'Jsx', 'Tailwind CSS'],
    liveUrl: 'https://gmhs-minchinabad.vercel.app/',
    githubUrl: 'https://github.com/chusamaikram/weather-app',
    featured: false,
    category: 'Web App',
  },
];

const categories = ['All', 'Featured', 'Web App', 'Dashboard'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : selectedCategory === 'Featured'
      ? projects.filter(p => p.featured)
      : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-10 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-4">
            My Projects
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Here are some of my recent projects that showcase my skills and expertise.
            Each project represents a unique challenge and creative solution.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-background'
                : 'glass text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} index={project.id} />
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-foreground hover:bg-white/5 hover:text-gradient"
            onClick={() => window.open('https://github.com/chusamaikram', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            View More on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
