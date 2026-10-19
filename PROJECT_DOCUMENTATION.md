# Enterprise Portfolio Architecture & Full-Stack Reference Handbook

This handbook provides an architectural breakdown, codebase map, logic explanation, operational commands, and Postman API testing reference for both the **Frontend (React 19 + Vite + Tailwind CSS)** and **Backend (Django 5 + Django REST Framework + Multi-Provider AI Service)**.

---

## 1. Executive Architecture Overview

```
                                +-------------------------------------------------------+
                                |               PUBLIC VISITOR & CLIENT                 |
                                +-------------------------------------------------------+
                                        |                                        |
                 HTTP (Port 5173)       v                                        v   HTTP (Port 8000)
    +-----------------------------------------------+        +-----------------------------------------------+
    |         REACT 19 + VITE FRONTEND             |        |             DJANGO 5 DRF BACKEND              |
    |-----------------------------------------------|        |-----------------------------------------------|
    | - WebGL 3D Holographic Hero Sphere            |        | - Versioned REST API (/api/v1/)              |
    | - Infinite Dual-Marquee Skills Slider         |        | - Enterprise JWT Auth (HttpOnly Cookies)      |
    | - Cybernetic Holographic About Bento          |        | - Unthrottled Production Health Checks        |
    | - Filterable Showcase Grid & Modals           |        | - Multi-Provider AI (Gemini, Groq, OpenAI)    |
    | - Strict Validation Contact Form              |        | - Semantic AI Cache & Auto-Invalidation       |
    | - Floating AI Chat Terminal                   |        | - AI Form Copilot & Email Reply Drafter       |
    | - Admin Dashboard with Sidebar Navigation     |        | - SQLite / PostgreSQL with Migrations         |
    | - Dual-Layer Persistence (API + LocalStorage) |        +-----------------------------------------------+
    +-----------------------------------------------+                                |
                            |                                                        |
                            +----------------- Axios Interceptors -------------------+
                                            Bearer Auth + Auto-Refresh
```

---

## 2. Complete Codebase Map & Directory Structure

```
my-portfolio/
│
├── backend/                               # Django 5 + Django REST Framework Root
│   ├── manage.py                          # Django CLI utility
│   ├── requirements.txt                   # Production Python dependencies
│   ├── core/                              # Core project configuration & health checks
│   │   ├── __init__.py
│   │   ├── settings.py                    # JWT, CORS, database, throttles, and apps
│   │   ├── urls.py                        # Central routing registry (/api/v1/)
│   │   ├── wsgi.py & asgi.py              # Deployment interfaces
│   │   └── health.py                      # Unthrottled cloud keepalive probe (/health/)
│   │
│   ├── authentication/                    # Enterprise JWT Authentication App
│   │   ├── models.py
│   │   ├── serializers.py                 # User and token serializers
│   │   ├── views.py                       # CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView
│   │   └── urls.py                        # /api/v1/auth/login/, refresh/, logout/, me/
│   │
│   ├── portfolio/                         # Core Portfolio Domain App
│   │   ├── models.py                      # Project, SkillCategory, Skill, Testimonial, Experience, ContactMessage, ProfileInfo
│   │   ├── serializers.py                 # DRF model serializers with camelCase mapping
│   │   ├── views.py                       # ViewSets with IsAdminOrReadOnly permissions, TelemetryView
│   │   └── urls.py                        # /api/v1/portfolio/ routes
│   │
│   ├── ai_assistant/                      # Multi-Provider AI & Semantic Caching App
│   │   ├── models.py                      # AISettings, AIConversationLog, AIResponseCache
│   │   ├── serializers.py                 # Chat and Copilot request/response serializers
│   │   ├── services.py                    # Multi-provider failover engine (Gemini, Groq, OpenAI)
│   │   ├── views.py                       # AIChatView, AICacheFlushView, AIDashboardGenerateView, etc.
│   │   └── urls.py                        # /api/v1/ai/ routes
│   │
│   ├── tests_e2e.py                       # Complete end-to-end integration test suite
│   ├── tests_health_and_ai_cache.py       # Health check, semantic cache & knowledge invalidation tests
│   └── tests_dashboard_copilot.py         # Form Copilot & message triage integration tests
│
├── src/                                   # React 19 Frontend Root
│   ├── index.css                          # Design tokens, custom utilities & marquee animations
│   ├── main.jsx                           # React DOM mount point & global providers
│   ├── App.jsx                            # React Router route definitions
│   │
│   ├── api/                               # Centralized API Integration
│   │   ├── endpoints.js                   # Central registry for all /api/v1/ routes
│   │   ├── axiosInstance.js               # Axios client with Bearer auth and 401 refresh interceptors
│   │   └── aiService.js                   # Client-side AI service bridge
│   │
│   ├── services/                          # Data Management Services
│   │   └── portfolio.service.js           # Dual-layer data layer (API with LocalStorage fallback)
│   │
│   ├── components/                        # Reusable Component Architecture
│   │   ├── layout/
│   │   │   ├── Navbar.jsx                 # Glassmorphic navbar with mobile menu & AI trigger
│   │   │   └── Footer.jsx                 # Cyberpunk footer with social beacons
│   │   └── ui/
│   │       ├── GlassCard.jsx              # Cybernetic glass container with glowing corners
│   │       ├── NeonButton.jsx             # Glowing action buttons
│   │       ├── SectionHeader.jsx          # Futuristic section title & badge wrapper
│   │       ├── TechBadge.jsx              # Micro-technology pills
│   │       └── TechMarqueeSlider.jsx      # Infinite opposite-direction dual-track skills marquee
│   │
│   ├── features/                          # Domain Feature Modules
│   │   ├── home/                          # Public Landing Page Features
│   │   │   ├── HomePage.jsx               # Main page assembly
│   │   │   ├── HeroSection.jsx            # Hero banner & action triggers
│   │   │   ├── HeroHologram.jsx           # Three.js 3D WebGL rotating particle sphere
│   │   │   ├── AboutBento.jsx             # Cybernetic operator HUD & interactive matrix
│   │   │   ├── ProjectsGrid.jsx           # Filterable projects catalog & preview modal
│   │   │   ├── TestimonialsSection.jsx    # Endorsement carousel
│   │   │   ├── ContactSection.jsx         # Form with strict client-side validation
│   │   │   └── AIChatTerminal.jsx         # Floating interactive cyber AI terminal
│   │   │
│   │   ├── dashboard/                     # Admin Control Center (/admin)
│   │   │   ├── AdminDashboard.jsx         # Dashboard shell & state management
│   │   │   ├── DashboardSidebar.jsx       # Responsive navigation sidebar
│   │   │   ├── DashboardHeader.jsx        # Telemetry bar, server status, quick actions
│   │   │   └── views/
│   │   │       ├── OverviewView.jsx       # System metrics & health overview
│   │   │       ├── ProjectsView.jsx       # Project catalog manager + thumbnail upload
│   │   │       ├── SkillsView.jsx         # Skills & categories manager
│   │   │       ├── TestimonialsView.jsx   # Testimonials manager
│   │   │       ├── MessagesView.jsx       # Inbound messages & AI reply drafter
│   │   │       ├── ExperienceView.jsx     # Career milestones manager
│   │   │       ├── AISettingsView.jsx     # AI providers, model switcher & cache manager
│   │   │       └── SettingsView.jsx       # Operator headshot studio & system settings
│   │   │
│   │   └── auth/
│   │       └── AdminRoute.jsx             # Protected route guard for /admin
│   │
│   └── images/                            # Optimized static assets & project mockups
│       ├── profile.webp                   # Baseline operator headshot
│       ├── zeeframes-thumbnail.webp       # Project showcase asset
│       ├── dentalook-thumbnail.webp       # Project showcase asset
│       ├── gmhs-thumbnail.webp            # Project showcase asset
│       ├── olyra.webp                     # Project showcase asset
│       ├── weather-thumbnail.webp         # Project showcase asset
│       └── zapta-contactus.webp           # Project showcase asset
```

---

## 3. Frontend Features & Implementation Logic

### 3.1 Public Portfolio Features

1. **Hero Section & 3D Hologram (`HeroSection.jsx`, `HeroHologram.jsx`)**:
   - Renders a 60 FPS Three.js WebGL canvas with an Icosahedron wireframe sphere and interactive particle field.
   - Includes real-time status beacons (`AVAILABLE FOR HIRE`), holographic title typography, and quick call-to-actions to launch the AI terminal or view projects.

2. **Infinite Dual-Marquee Skills Slider (`TechMarqueeSlider.jsx`)**:
   - Dual tracks sliding continuously in **opposite directions**:
     - **Track 1 (Leftward)**: Next.js, jQuery, Bootstrap, Tailwind CSS (with highlighted cyan glow), HTML5, CSS3, JavaScript, TypeScript, React.js, Redux Toolkit, Framer Motion, Three.js, Echarts.
     - **Track 2 (Rightward)**: Vercel, Node.js, npm, Webpack, Figma, Git, GitHub, VS Code, Django 5, Python, REST APIs, Postman, Docker, Vite.
   - Left and right gradient fade masks (`from-[#050814] to-transparent`) for seamless edge transitions.
   - Pause-on-hover interaction (`pause-hover`) enables visitors to inspect any technology pill.

3. **Cybernetic Holographic About Section (`AboutBento.jsx`)**:
   - **Holographic Operator HUD Frame**: Reticle brackets, laser scanline animation, and active status indicator.
   - **Dynamic Avatar Synchronization**: Automatically pulls the headshot configured in the dashboard from `portfolioService.getProfileInfo()`, falling back to `profile.webp`.
   - **Interactive Command Matrix Switcher**:
     - *Meters Mode*: Visual skill progress bars with neon gradient meters.
     - *Manifest Mode*: CLI terminal view displaying `operator_manifest.json` with a 1-click **"Copy Config"** button.
   - **Hardware & Telemetry Grid**: 4 live metric pods (Production Systems, Frame Budget, Lighthouse Score, Payload Size).
   - **Mission Directives**: Holographic cards for Architecture, Kinetic 3D, and Resilient API Integration.

4. **Projects Showcase & Interactive Modal (`ProjectsGrid.jsx`)**:
   - Live category tabs (All, Full Stack, Frontend, UI/UX, AI Tools).
   - Project cards with responsive thumbnail previews, technology badges, live demo links, and GitHub repository links.
   - Deep-dive modal revealing architecture notes, performance metrics, and full tech stacks.

5. **Contact Form with Strict Validation (`ContactSection.jsx`)**:
   - Real-time client-side validation for name (min 2 chars), valid email format, and message content (min 10 chars).
   - Submits directly to backend endpoint `POST /api/v1/portfolio/contact/`.
   - Heuristic offline fallback: If backend is unreachable, saves message to `localStorage` and alerts the user gracefully.

6. **Floating Holographic AI Terminal (`AIChatTerminal.jsx`)**:
   - Collapsible terminal accessible via bottom floating button or navbar AI button.
   - Pre-configured prompt chips (*"Tell me about Usama"*, *"What is your tech stack?"*, *"Explain ZeeFrames"*).
   - Powered by backend `/api/v1/ai/chat/` with semantic caching for sub-10ms response times on repeated questions.

---

### 3.2 Admin Control Center (`/admin`)

1. **Dashboard Shell & Navigation (`AdminDashboard.jsx`, `DashboardSidebar.jsx`)**:
   - Sidebar with 8 operational modules: Overview, Projects, Skills, Testimonials, Messages, Experience, AI Settings, Settings.
   - Dynamic top header showing live server connectivity, latency ping, and quick action buttons.

2. **Project Manager with Thumbnail Upload (`ProjectsView.jsx`)**:
   - Full CRUD: Create, Edit, Delete, Feature/Unfeature.
   - **Thumbnail Manager**: Upload local images (PNG/JPG/WebP up to 5MB converted via `FileReader` to Base64) or choose from preset project assets.
   - **Form Copilot**: "Write with AI" buttons for Title, Description, Architecture, and Metrics.

3. **Inbound Messages & AI Triage (`MessagesView.jsx`)**:
   - Real-time unread/read message tracking.
   - **AI Inbox Triage**: Instant analysis identifying high-priority inquiries.
   - **1-Click AI Reply Drafter**: Automatically drafts a personalized response tailored to the visitor's query and pre-populates a `mailto:` link for immediate sending.

4. **Operator Headshot & Settings Studio (`SettingsView.jsx`)**:
   - **Live Avatar Preview**: Displays current headshot with cybernetic borders and CUSTOM vs DEFAULT badge.
   - **Direct Upload**: File input with drag-and-drop or file browser for headshot images.
   - **Direct URL**: Input field for hosted image links (Cloudinary, Unsplash, GitHub).
   - **Quick Actions**: "Reset to Default Photo" and "Clear Custom Avatar".
   - **System Utilities**: Live backend ping, JSON database backup export, and factory reset.

5. **AI Settings & Semantic Cache Control (`AISettingsView.jsx`)**:
   - Switch active provider between Google Gemini, Groq (Llama 3.3), and OpenAI (GPT-4o mini).
   - Live connectivity test button with latency telemetry.
   - Cache statistics readout (Hit count, API requests saved, cached entries) and 1-click **"Flush Cache"** button.

---

## 4. Backend Architecture & Implementation Logic

### 4.1 Django 5 App Structure

1. **`core` App**:
   - `settings.py`: Configures `rest_framework`, `rest_framework_simplejwt`, `corsheaders`, `portfolio`, `authentication`, `ai_assistant`.
   - `health.py`: Unthrottled production health check (`/health/`, `/api/v1/health/`) verifying database connectivity, server uptime, and timestamp for cloud keepalives.

2. **`authentication` App**:
   - `CookieTokenObtainPairView`: On login (`POST /api/v1/auth/login/`), returns a short-lived access JWT (15 mins) in the response body and sets a long-lived refresh JWT (7 days) inside a secure `HttpOnly`, `SameSite='Lax'` cookie.
   - `CookieTokenRefreshView`: Reads the refresh token from either the HttpOnly cookie or the request body and returns a new access token.
   - `LogoutView`: Clears the refresh cookie and invalidates the session.

3. **`portfolio` App**:
   - **Models**:
     - `Project`: Title, description, Base64/URL image, tags, live URL, GitHub URL, category, architecture, metrics, featured flag, order.
     - `SkillCategory` & `Skill`: Hierarchical skill structure with proficiency levels and icon references.
     - `Testimonial`: Client quotes, ratings, and avatar strings.
     - `Experience`: Timeline milestones, companies, and roles.
     - `ContactMessage`: Inbound messages from the contact form with `is_read` flag.
     - `ProfileInfo`: Bio, designation, location, phone, email, social links, and `avatar` field.
   - **Permissions**: `IsAdminOrReadOnly` grants public read access to all endpoints, while restricting write operations (POST, PUT, DELETE) to authenticated administrators.

4. **`ai_assistant` App**:
   - **Multi-Provider AI Service (`services.py`)**:
     - Priority chain: **Google Gemini** -> **Groq (Llama 3.3)** -> **OpenAI (GPT-4o mini)** -> **Local Deterministic Fallback**.
     - Dynamic Database Context Injection: Queries live database records (`Project.objects.all()`, `Skill.objects.all()`, `ProfileInfo.objects.first()`) to formulate an up-to-date system prompt.
   - **Semantic AI Caching (`AIResponseCache`)**:
     - Intercepts incoming questions, normalizes the text (stripping punctuation, lowercasing, whitespace collapsing), and looks up cached responses.
     - Automatically increments knowledge version (`v11` -> `v12`) whenever projects or skills are updated, invalidating stale cache entries.
   - **AI Form Copilot (`AIDashboardGenerateView`)**:
     - Powers the dashboard "Write with AI" features for title, description, architecture, and metrics generation.
   - **AI Message Drafter (`AIDraftReplyView`)**:
     - Analyzes received contact messages and drafts contextual, professional email responses.

---

## 5. Commands to Run the Backend & Frontend

### 5.1 Running the Django Backend

Open a PowerShell or Terminal window:

```powershell
# 1. Navigate to the backend directory
cd "d:\Web Dev\Frontend\React\portfolio\my-portfolio\backend"

# 2. Activate the Python virtual environment
.\venv\Scripts\Activate.ps1
# (Or run Python directly: .\venv\Scripts\python.exe manage.py ...)

# 3. Apply database migrations
python manage.py migrate

# 4. (Optional) Create an admin superuser if needed
python manage.py createsuperuser

# 5. Start the Django development server on port 8000
python manage.py runserver 0.0.0.0:8000
```

> **Backend URL:** `http://localhost:8000`  
> **Django Admin Panel:** `http://localhost:8000/admin/`  
> **Default Admin Credentials:** Username: `admin` | Password: `admin123`

---

### 5.2 Running the React Frontend

Open a second PowerShell or Terminal window:

```powershell
# 1. Navigate to the frontend project root
cd "d:\Web Dev\Frontend\React\portfolio\my-portfolio"

# 2. Start the Vite development server
npm run dev
```

> **Frontend URL:** `http://localhost:5173`  
> **Admin Dashboard URL:** `http://localhost:5173/admin`

---

## 6. Complete Postman API Testing Guide

### 6.1 Postman Setup

1. In Postman, create a new Environment or set a variable:
   - Variable: `base_url`
   - Initial / Current Value: `http://localhost:8000`
2. Under collection settings or request headers, configure:
   - `Content-Type: application/json`

---

### 6.2 Health & Infrastructure Endpoints

#### 1. Keepalive Health Check
- **Method:** `GET`
- **URL:** `{{base_url}}/health/` (or `{{base_url}}/api/v1/health/`)
- **Headers:** None required
- **Expected Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "portfolio-backend",
  "environment": "development",
  "database": "ok",
  "uptime_seconds": 2450,
  "timestamp": "2026-10-19T17:45:00.000000Z",
  "version": "1.0.0"
}
```

---

### 6.3 Authentication Endpoints

#### 2. Admin Login (Obtain JWT & Set Cookie)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/auth/login/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Expected Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "usama.code404@gmail.com"
  }
}
```
> **Tip for Postman:** Copy the `access` token. In subsequent protected requests, add a Header:  
> `Authorization: Bearer <your_access_token>`.

#### 3. Refresh Access Token
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/auth/refresh/`
- **Headers:** `Content-Type: application/json`
- **Request Body (optional if Postman manages cookies):**
```json
{
  "refresh": "<your_refresh_token_if_not_using_cookies>"
}
```

#### 4. Current Authenticated User (`/me`)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/v1/auth/me/`
- **Headers:**
  - `Authorization: Bearer <your_access_token>`

---

### 6.4 Portfolio Domain Endpoints

#### 5. Get Public Projects Catalog
- **Method:** `GET`
- **URL:** `{{base_url}}/api/v1/portfolio/projects/`
- **Headers:** None required (Public access)

#### 6. Create New Project (Admin Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/portfolio/projects/`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_access_token>`
- **Request Body:**
```json
{
  "title": "QuantumFlow AI Dashboard",
  "description": "High-throughput telemetry dashboard engineered with React 19 and WebGL shaders.",
  "category": "Web App",
  "tags": ["React 19", "Tailwind CSS", "Three.js"],
  "featured": true,
  "architecture": "Atomic state management with decoupled WebGL canvas layer.",
  "metrics": "99.8% Lighthouse, <12ms frame render budget",
  "live_url": "https://example.com/demo",
  "github_url": "https://github.com/chusamaikram/quantumflow",
  "image": ""
}
```

#### 7. Update Profile Specs & Avatar (Admin Protected)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/v1/portfolio/profile/`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_access_token>`
- **Request Body:**
```json
{
  "name": "Usama Ikram",
  "title": "Principal Frontend Architect & Web Engineer",
  "bio": "Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics.",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  "location": "Lahore, Pakistan",
  "status": "Available for Freelance & Full-time Roles"
}
```

#### 8. Submit Contact Message (Public Endpoint)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/portfolio/contact/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@skynet-defense.com",
  "subject": "Frontend Architecture Contract",
  "message": "We would like to hire you to architect our upcoming Next.js enterprise dashboard."
}
```

#### 9. Get System Telemetry Overview
- **Method:** `GET`
- **URL:** `{{base_url}}/api/v1/portfolio/telemetry/`
- **Headers:** `Authorization: Bearer <your_access_token>`

---

### 6.5 AI Assistant & Copilot Endpoints

#### 10. AI Chat with Semantic Caching (Public Endpoint)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/ai/chat/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "message": "What projects has Usama built recently?"
}
```
- **Response Features:**
  - First request: `is_cached: false` (generates fresh response from AI provider).
  - Duplicate request: `is_cached: true` (served in <15ms directly from `AIResponseCache`).

#### 11. AI Form Copilot Generator (Admin Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/ai/copilot/generate/`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_access_token>`
- **Request Body:**
```json
{
  "field": "description",
  "context": {
    "title": "Aura Health Dashboard",
    "tags": ["React 19", "Echarts", "Tailwind CSS"],
    "category": "Web App"
  }
}
```

#### 12. AI Inbox Triage Analysis (Admin Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/v1/ai/copilot/inbox-analysis/`
- **Headers:**
  - `Authorization: Bearer <your_access_token>`

#### 13. AI Draft Email Reply (Admin Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/ai/copilot/draft-reply/`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_access_token>`
- **Request Body:**
```json
{
  "message_id": 1
}
```
- **Response:**
  - Returns `reply_text` along with a pre-formatted `mailto_url` with URI-encoded subject and body ready for 1-click dispatch.

#### 14. Flush AI Semantic Cache (Admin Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/v1/ai/cache/flush/`
- **Headers:**
  - `Authorization: Bearer <your_access_token>`

---

## 7. Verification & Automated Testing

You can run the automated Python integration test suites directly from the terminal at any time:

```powershell
# In backend/ directory:
.\venv\Scripts\python.exe tests_e2e.py
.\venv\Scripts\python.exe tests_health_and_ai_cache.py
.\venv\Scripts\python.exe tests_dashboard_copilot.py
```
Each test suite outputs clear `[PASS]` assertions for every endpoint, authentication flow, and AI cache operation.
