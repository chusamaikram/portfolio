import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from portfolio.models import (
    Project,
    SkillCategory,
    Skill,
    Testimonial,
    Experience,
    ContactMessage,
    ProfileInfo,
)
from ai_assistant.models import AISetting

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds database with Usama's portfolio data, projects, skills, AI settings, and default admin superuser"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Initializing Portfolio Seeding Process..."))

        # 1. Superuser Setup
        admin_username = os.getenv('ADMIN_USERNAME', 'admin')
        admin_email = os.getenv('ADMIN_EMAIL', 'usama.code404@gmail.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')

        admin_user, created = User.objects.get_or_create(
            username=admin_username,
            defaults={
                'email': admin_email,
                'first_name': 'Usama',
                'last_name': 'Ikram',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password(admin_password)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created default admin superuser: '{admin_username}'"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated default admin superuser credentials for: '{admin_username}'"))

        # 2. Seed Profile Information
        ProfileInfo.objects.update_or_create(
            id=1,
            defaults={
                'name': 'Usama Ikram',
                'title': 'Principal Frontend Architect & Web Engineer',
                'bio': 'Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics.',
                'location': 'Lahore, Pakistan',
                'email': 'usama.code404@gmail.com',
                'phone': '+92 309 8525906',
                'github': 'https://github.com/chusamaikram',
                'linkedin': 'https://linkedin.com/in/usama-ikram-252052182',
                'status': 'Available for Freelance & Full-time Roles',
            }
        )
        self.stdout.write(self.style.SUCCESS("Seeded Profile Information"))

        # 3. Seed Projects (Olyra, UsamaCart, Dentalook, ZeeFrames, GMHS, WeatherMate, Zapta)
        projects_data = [
            {
                'title': 'ZeeFrames – UI/UX Replica Project',
                'description': 'A pixel-perfect frontend replica of the ZeeFrames design studio website, recreated to practice layout precision, responsiveness, and modern UI structure.',
                'image': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
                'tags': ['React.js', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
                'live_url': 'https://zeeframes-v03.vercel.app',
                'github_url': 'https://github.com/chusamaikram/Zeeframes',
                'featured': True,
                'category': 'Portfolio',
                'architecture': 'Component-driven layout with custom micro-animations & responsive breakpoints',
                'metrics': '99% Lighthouse Accessibility, <1.2s LCP',
                'order': 1,
            },
            {
                'title': 'Olyra – Health & Wellness Platform',
                'description': 'A modern health-focused web application designed to provide users with accessible tools related to wellness, nutrition, and healthy living with dynamic Echarts data visualization.',
                'image': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
                'tags': ['Next.js', 'Tailwind CSS', 'Echarts', 'Lucide-react', 'Zustand'],
                'live_url': 'https://olyra-v02.vercel.app/',
                'github_url': 'https://github.com/chusamaikram/olyra',
                'featured': True,
                'category': 'Web App',
                'architecture': 'Modular Zustand state management, SSR-ready Next.js layout, and Echarts analytics',
                'metrics': 'Real-time telemetry, 60fps chart rendering',
                'order': 2,
            },
            {
                'title': 'Dentalook – Dental Clinic Website Design',
                'description': 'A responsive dental clinic web app replica featuring interactive line and pie charts to visualize patient and appointment data in real-time.',
                'image': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
                'tags': ['React.js', 'Echarts', 'Tailwind CSS'],
                'live_url': 'https://dentalook-v2.vercel.app/',
                'github_url': 'https://github.com/chusamaikram/React-Projects/tree/master/dentalook',
                'featured': True,
                'category': 'Dashboard',
                'architecture': 'Custom dashboard widgets with dynamic reactive data pipelines',
                'metrics': 'Multi-screen responsive viewport compliance',
                'order': 3,
            },
            {
                'title': 'UsamaCart – E-Commerce Architecture Platform',
                'description': 'Full-featured enterprise e-commerce platform with reactive product filtering, client-side cart persistence, Stripe checkout simulation, and optimized image delivery.',
                'image': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
                'tags': ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'REST API'],
                'live_url': 'https://usamacart-v1.vercel.app',
                'github_url': 'https://github.com/chusamaikram/React-Projects/tree/master/usamacart',
                'featured': True,
                'category': 'Web App',
                'architecture': 'Slice-based Redux state management, custom debounce hooks, and lazy routing',
                'metrics': 'Sub-50ms cart state mutations, 98% SEO score',
                'order': 4,
            },
            {
                'title': 'Govt High School Minchinabad – Educational Website',
                'description': 'A professionally designed responsive website showcasing a government high school’s academic programs, faculty, admissions, events, and student success stories to engage the community.',
                'image': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
                'tags': ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
                'live_url': 'https://gmhs-minchinabad.vercel.app/',
                'github_url': 'https://github.com/chusamaikram/gmhs-portfolio',
                'featured': False,
                'category': 'Portfolio',
                'architecture': 'Semantic HTML5 structure, lightweight zero-dependency asset pipeline',
                'metrics': '100% SEO score, optimized mobile UX',
                'order': 5,
            },
            {
                'title': 'ZAPTA Contact Page – UI Replica',
                'description': 'A pixel-perfect replica of the original ZAPTA Technologies contact page built to practice layout accuracy, responsive design, and modern UI structure.',
                'image': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
                'tags': ['HTML5', 'JavaScript', 'Tailwind CSS', 'jQuery'],
                'live_url': 'https://zapta-replica.vercel.app/',
                'github_url': 'https://github.com/chusamaikram/Zapta-contactUs',
                'featured': False,
                'category': 'Portfolio',
                'architecture': 'Asynchronous form validation, interactive micro-states & fluid transitions',
                'metrics': 'Zero layout shifts (CLS < 0.01)',
                'order': 6,
            },
            {
                'title': 'WeatherMate – API Integration Project',
                'description': 'A lightweight weather app built to implement core logic for fetching and displaying real-time weather data from a free public API with dynamic updates.',
                'image': 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80',
                'tags': ['React.js', 'JSX', 'Tailwind CSS', 'REST API'],
                'live_url': 'https://weather-mate-live.vercel.app/',
                'github_url': 'https://github.com/chusamaikram/weather-app',
                'featured': False,
                'category': 'Web App',
                'architecture': 'Axios REST client with error boundary isolation & geolocation caching',
                'metrics': 'Sub-300ms API response hydration',
                'order': 7,
            },
        ]

        Project.objects.all().delete()
        for p in projects_data:
            Project.objects.create(**p)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(projects_data)} projects"))

        # 4. Seed Skills Matrix
        SkillCategory.objects.all().delete()
        skills_structure = [
            {
                'name': 'Frontend Core',
                'order': 1,
                'skills': [
                    {'name': 'HTML5', 'level': 95, 'icon': 'Code', 'highlight': 'Semantic DOM, Accessibility standards', 'order': 1},
                    {'name': 'CSS3 / CSS Modules', 'level': 92, 'icon': 'Palette', 'highlight': 'Flexbox, CSS Grid, Custom properties', 'order': 2},
                    {'name': 'JavaScript (ES6+)', 'level': 90, 'icon': 'Terminal', 'highlight': 'Async/Await, Closures, DOM manipulation', 'order': 3},
                    {'name': 'TypeScript', 'level': 65, 'icon': 'ShieldCheck', 'highlight': 'Generics, Strict typing, Interface design', 'order': 4},
                ]
            },
            {
                'name': 'Frameworks & Libraries',
                'order': 2,
                'skills': [
                    {'name': 'React.js 19', 'level': 92, 'icon': 'Atom', 'highlight': 'Hooks, Suspense, Concurrent rendering', 'order': 1},
                    {'name': 'Tailwind CSS', 'level': 95, 'icon': 'Wind', 'highlight': 'Tailwind Merge, CVA, Glassmorphic design', 'order': 2},
                    {'name': 'Next.js 14/15', 'level': 55, 'icon': 'Layers', 'highlight': 'App Router, Server components, SSR', 'order': 3},
                    {'name': 'Framer Motion', 'level': 70, 'icon': 'Sparkles', 'highlight': '3D transforms, Gesture animations, Bento grids', 'order': 4},
                    {'name': 'Three.js / R3F', 'level': 50, 'icon': 'Box', 'highlight': 'Canvas optimization, 60FPS shaders, Wireframes', 'order': 5},
                    {'name': 'Echarts / Recharts', 'level': 82, 'icon': 'BarChart2', 'highlight': 'Real-time telemetry, Data visualization', 'order': 6},
                ]
            },
            {
                'name': 'Architecture & Tools',
                'order': 3,
                'skills': [
                    {'name': 'Django 5 & DRF', 'level': 85, 'icon': 'Server', 'highlight': 'Modular apps, Cookie JWT, ViewSets, Throttling', 'order': 1},
                    {'name': 'Git & GitHub', 'level': 80, 'icon': 'GitBranch', 'highlight': 'Trunk workflows, PR reviews, CI/CD', 'order': 2},
                    {'name': 'Vite & Modern Bundlers', 'level': 90, 'icon': 'Zap', 'highlight': 'HMR tuning, Chunk splitting, Bundle audit', 'order': 3},
                    {'name': 'REST APIs & Interceptors', 'level': 88, 'icon': 'Globe', 'highlight': 'Bearer auth, Token refreshing, Retries', 'order': 4},
                ]
            },
        ]

        for cat_data in skills_structure:
            cat = SkillCategory.objects.create(name=cat_data['name'], order=cat_data['order'])
            for s in cat_data['skills']:
                Skill.objects.create(category=cat, **s)
        self.stdout.write(self.style.SUCCESS("Seeded Skill Categories & Skills Matrix"))

        # 5. Seed Testimonials
        Testimonial.objects.all().delete()
        testimonials_data = [
            {
                'name': 'David Chen',
                'role': 'VP of Engineering',
                'company': 'Aura Health & Web',
                'content': 'Usama translated our complex specifications into a blazing-fast React and Echarts application. His eye for micro-interactions and clean state architecture is remarkable.',
                'rating': 5,
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'visible': True,
                'date': 'October 2026',
            },
            {
                'name': 'Amara Khan',
                'role': 'Lead UI/UX Designer',
                'company': 'Zeeframes Studios',
                'content': 'The level of pixel accuracy Usama achieved on our studio replica was astonishing. Flawless responsive breakpoints and fluid 60FPS animations.',
                'rating': 5,
                'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                'visible': True,
                'date': 'September 2026',
            },
            {
                'name': 'Marcus Vance',
                'role': 'Senior Frontend Architect',
                'company': 'Apex Digital Labs',
                'content': 'Usama understands modern enterprise architecture deeply: robust token refresh interceptors, lightweight WebGL loading, and zero layout shift. Highly recommended.',
                'rating': 5,
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'visible': True,
                'date': 'August 2026',
            },
        ]
        for t in testimonials_data:
            Testimonial.objects.create(**t)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(testimonials_data)} Testimonials"))

        # 6. Seed Career Experiences
        Experience.objects.all().delete()
        experiences_data = [
            {
                'role': 'Frontend Web Developer & UI Architect',
                'company': 'Independent / Freelance',
                'period': '2026 - Present',
                'description': 'Architecting responsive React 19 web applications, UI/UX replicas, and lightweight WebGL graphics with Tailwind CSS and Framer Motion.',
                'tags': ['React 19', 'Tailwind CSS', 'Next.js', 'Three.js', 'Axios'],
                'order': 1,
            },
            {
                'role': 'Frontend Engineering Contributor',
                'company': 'Open Source Ecosystem & Web Labs',
                'period': '2025 - 2026',
                'description': 'Built accessible responsive UI components, optimized bundle code-splitting, and integrated REST APIs with resilient error boundaries.',
                'tags': ['JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'Git'],
                'order': 2,
            },
        ]
        for exp in experiences_data:
            Experience.objects.create(**exp)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(experiences_data)} Career Experiences"))

        # 7. Seed Sample Contact Messages
        ContactMessage.objects.all().delete()
        messages_data = [
            {
                'name': 'Sarah Connor (Cyberdyne Systems)',
                'email': 'sarah@resistance.ai',
                'subject': 'Frontend Architecture Contract',
                'message': 'Hello Usama, we reviewed your Olyra and Dentalook projects. We are looking for an architect to build our 2026 operations dashboard.',
                'is_read': False,
            },
            {
                'name': 'Alex Rivera (Venture Labs)',
                'email': 'alex@venturelabs.dev',
                'subject': 'React 19 & Tailwind Portfolio Review',
                'message': 'Loved your 3D wireframe and Bento grid layout. Incredible performance optimization.',
                'is_read': True,
            },
        ]
        for msg in messages_data:
            ContactMessage.objects.create(**msg)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(messages_data)} Sample Contact Messages"))

        # 8. Seed AI Integration Settings
        AISetting.objects.update_or_create(
            id=1,
            defaults={
                'primary_provider': 'gemini',
                'primary_model': 'gemini-2.5-flash',
                'primary_api_key': os.getenv('GEMINI_API_KEY', ''),
                'fallback_provider': 'groq',
                'fallback_model': 'llama-3.3-70b-versatile',
                'fallback_api_key': os.getenv('GROQ_API_KEY', ''),
                'temperature': 0.7,
                'system_instruction_extra': '',
                'is_active': True,
            }
        )
        self.stdout.write(self.style.SUCCESS("Seeded AI Provider Settings (Gemini Primary + Groq Fallback)"))

        self.stdout.write(self.style.SUCCESS("\n[SUCCESS] Enterprise Database Seeding Completed Successfully!"))
