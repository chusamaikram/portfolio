import os
import re
import time
import hashlib
import logging
import requests
from django.conf import settings
from .models import AISetting, AIResponseCache, AIKnowledgeItem
from portfolio.models import Project, SkillCategory, Experience, ProfileInfo, Testimonial

logger = logging.getLogger(__name__)

STOP_WORDS = {
    'what', 'is', 'are', 'the', 'a', 'an', 'can', 'you', 'tell', 'me', 'about',
    'please', 'hi', 'hello', 'hey', 'do', 'does', 'how', 'who', 'show', 'give',
    'know', 'usama', 'usamas', 'usama\'s', 'he', 'his', 'him', 'of', 'for', 'in',
    'at', 'with', 'and', 'or', 'to', 'from', 'any', 'some', 'could', 'would',
}


def normalize_query(query: str):
    """
    Normalizes a user question by lowercasing, stripping punctuation,
    filtering common conversational fillers, and sorting semantic keywords.
    Returns (query_hash, normalized_string).
    """
    clean = re.sub(r'[^\w\s]', ' ', query.lower())
    words = [w.strip() for w in clean.split() if w.strip()]

    # Filter stop words to find core intent tokens
    meaningful = [w for w in words if w not in STOP_WORDS]
    if not meaningful:
        meaningful = words  # fallback if all words were filtered

    # Sort meaningful words to catch permutations ("skills usama" vs "usama skills")
    canonical = " ".join(sorted(meaningful))
    query_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()
    return query_hash, canonical


def build_system_context():
    """
    Dynamically extracts Usama's live profile, projects, skills, career history,
    client testimonials, and continuous knowledge items from the database.
    """
    ai_setting, _ = AISetting.objects.get_or_create(id=1)

    # 1. Profile Bio
    profile = ProfileInfo.objects.first()
    if profile:
        profile_str = (
            f"Name: {profile.name}\n"
            f"Title: {profile.title}\n"
            f"Bio: {profile.bio}\n"
            f"Location: {profile.location}\n"
            f"Email: {profile.email}\n"
            f"Phone: {profile.phone}\n"
            f"GitHub: {profile.github}\n"
            f"LinkedIn: {profile.linkedin}\n"
            f"Status: {profile.status}\n"
        )
    else:
        profile_str = (
            "Name: Usama Ikram\n"
            "Title: Principal Frontend Architect & Web Engineer\n"
            "Email: usama.code404@gmail.com\n"
            "Location: Lahore, Pakistan\n"
        )

    # 2. Projects Catalog (Dynamic & Chronological)
    projects = Project.objects.all().order_by('order', '-created_at')
    project_lines = []
    for p in projects:
        project_lines.append(
            f"- Project: {p.title}\n"
            f"  Category: {p.category} | Featured: {p.featured}\n"
            f"  Description: {p.description}\n"
            f"  Tags: {', '.join(p.tags) if isinstance(p.tags, list) else p.tags}\n"
            f"  Architecture: {p.architecture}\n"
            f"  Metrics: {p.metrics}\n"
            f"  Live Demo: {p.live_url}\n"
            f"  GitHub: {p.github_url}\n"
            f"  Last Updated: {p.updated_at.strftime('%Y-%m-%d') if p.updated_at else 'Current'}\n"
        )
    projects_str = "\n".join(project_lines) if project_lines else "No projects cataloged yet."

    # 3. Skills Matrix (Categorized & Scored)
    categories = SkillCategory.objects.all().prefetch_related('skills')
    skills_lines = []
    for cat in categories:
        cat_skills = [f"{s.name} ({s.level}%) - {s.highlight}" for s in cat.skills.all()]
        skills_lines.append(f"* {cat.name}: {', '.join(cat_skills)}")
    skills_str = "\n".join(skills_lines) if skills_lines else "Modern React 19, Tailwind CSS, TypeScript, Next.js, and Django 5."

    # 4. Career Experiences & Timeline
    experiences = Experience.objects.all().order_by('order', '-created_at')
    exp_lines = []
    for e in experiences:
        exp_lines.append(f"- {e.role} at {e.company} ({e.period}): {e.description}")
    exp_str = "\n".join(exp_lines) if exp_lines else "Independent UI/UX Architect and Open Source Contributor."

    # 5. Client Testimonials & Social Proof
    testimonials = Testimonial.objects.filter(visible=True)
    test_lines = []
    for t in testimonials:
        test_lines.append(f"- \"{t.content}\" — {t.name}, {t.role} at {t.company} ({t.rating}/5 stars)")
    test_str = "\n".join(test_lines) if test_lines else "Multiple verified 5-star recommendations from engineering leads."

    # 6. Continuous Knowledge Memory & FAQ Items
    knowledge_items = AIKnowledgeItem.objects.filter(is_active=True)
    kn_lines = []
    for k in knowledge_items:
        kn_lines.append(f"- [{k.topic}]: {k.content}")
    kn_str = "\n".join(kn_lines) if kn_lines else "Always eager to take on scalable frontend architecture and engineering challenges."

    system_instruction = f"""
You are Cypher, Usama Ikram's portfolio assistant.
Your mission is to represent Usama with technical precision, cordial professionalism, and authentic clarity.
Your name is Cypher. Keep your tone natural, helpful, realistic, and friendly—never robotic, cheesy, or overly dramatic.
Never use sci-fi clichés like "neural core", "protocol v2.4", "matrix", or trailing slashes.

=== KNOWLEDGE VERSION: {ai_setting.knowledge_version} ===
You possess continuous, real-time learning: whenever Usama updates skills, adds new skills, or deploys new projects, your data updates instantly.
Always learn from old data, new data, and updated data to explain his evolution and present his latest achievements accurately.

=== USAMA'S LIVE PROFILE DATA ===
{profile_str}

=== SHOWCASE PROJECTS ===
{projects_str}

=== TECHNICAL SKILLS MATRIX ===
{skills_str}

=== CAREER EXPERIENCES ===
{exp_str}

=== CLIENT ENDORSEMENTS & TESTIMONIALS ===
{test_str}

=== SPECIALIZED KNOWLEDGE MEMORY ===
{kn_str}

=== RESPONSE GUIDELINES ===
- Speak naturally as Cypher, Usama's assistant ("Usama built...", "He designed...").
- Format responses using clean structured Markdown:
  * Highlight project or feature titles in bold (**Project Name**).
  * Use bullet points with key-value labels:
    • **Architecture**: [details]
    • **Tech Stack**: [technologies]
    • **Metrics**: [performance telemetry]
    • **Live URL**: [link]
  * When mentioning URLs, provide the full URL clearly so the UI renders it as an interactive link chip.
- Be concise, direct, and highlight real architectural details (e.g. Zustand state, WebGL, sub-1.2s LCP) whenever relevant.
- When asked about skills or projects, mention his newest additions as well as his core foundations.
- If a visitor asks to hire or contact Usama, provide his direct email ({getattr(profile, 'email', 'usama.code404@gmail.com')}) and direct them to the contact form.
"""
    return system_instruction.strip()


def call_gemini(api_key, model_name, system_instruction, user_message, history=None, temperature=0.7):
    """
    Invokes Google Gemini inference using the official google-genai SDK
    """
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=float(temperature),
    )

    contents = []
    if history and isinstance(history, list):
        for msg in history[-6:]:
            text = msg.get('text') or msg.get('content') or ''
            if text:
                contents.append(text)
    contents.append(user_message)

    response = client.models.generate_content(
        model=model_name or 'gemini-2.5-flash',
        contents=contents,
        config=config,
    )
    return response.text.strip()


def call_groq(api_key, model_name, system_instruction, user_message, history=None, temperature=0.7):
    """
    Invokes Groq Cloud ultra-fast inference via REST API (OpenAI-compatible)
    """
    messages = [{'role': 'system', 'content': system_instruction}]
    if history and isinstance(history, list):
        for msg in history[-6:]:
            role = 'assistant' if msg.get('sender') == 'ai' or msg.get('role') == 'assistant' else 'user'
            text = msg.get('text') or msg.get('content') or ''
            if text:
                messages.append({'role': role, 'content': text})
    messages.append({'role': 'user', 'content': user_message})

    response = requests.post(
        'https://api.groq.com/openai/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': model_name or 'llama-3.3-70b-versatile',
            'messages': messages,
            'temperature': float(temperature),
            'max_tokens': 1024,
        },
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    return data['choices'][0]['message']['content'].strip()


def call_openai(api_key, model_name, system_instruction, user_message, history=None, temperature=0.7):
    """
    Invokes OpenAI inference via REST API
    """
    messages = [{'role': 'system', 'content': system_instruction}]
    if history and isinstance(history, list):
        for msg in history[-6:]:
            role = 'assistant' if msg.get('sender') == 'ai' or msg.get('role') == 'assistant' else 'user'
            text = msg.get('text') or msg.get('content') or ''
            if text:
                messages.append({'role': role, 'content': text})
    messages.append({'role': 'user', 'content': user_message})

    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': model_name or 'gpt-4o-mini',
            'messages': messages,
            'temperature': float(temperature),
            'max_tokens': 1024,
        },
        timeout=20,
    )
    response.raise_for_status()
    data = response.json()
    return data['choices'][0]['message']['content'].strip()


def execute_provider_inference(provider, api_key, model_name, system_instruction, user_message, history, temperature):
    """
    Dispatches call to the matching provider handler
    """
    if provider == 'gemini':
        return call_gemini(api_key, model_name, system_instruction, user_message, history, temperature)
    elif provider == 'groq':
        return call_groq(api_key, model_name, system_instruction, user_message, history, temperature)
    elif provider == 'openai':
        return call_openai(api_key, model_name, system_instruction, user_message, history, temperature)
    else:
        raise ValueError(f"Unsupported AI provider: {provider}")


def test_provider_connection(provider, api_key, model_name):
    """
    Performs a live ping test to verify the provider API key and model connectivity
    """
    start_time = time.time()
    test_prompt = "Hello! Please reply with 'READY' to verify connection."

    if provider == 'gemini':
        from google import genai
        client = genai.Client(api_key=api_key)
        res = client.models.generate_content(
            model=model_name or 'gemini-2.5-flash',
            contents=test_prompt
        )
        reply = res.text
    elif provider == 'groq':
        reply = call_groq(api_key, model_name, "You are a test agent.", test_prompt, temperature=0.1)
    elif provider == 'openai':
        reply = call_openai(api_key, model_name, "You are a test agent.", test_prompt, temperature=0.1)
    else:
        raise ValueError(f"Unknown provider '{provider}'")

    latency_ms = int((time.time() - start_time) * 1000)
    return {
        'success': True,
        'provider': provider,
        'model': model_name,
        'latency_ms': latency_ms,
        'reply': reply[:100],
    }


def synthesize_local_context_response(user_message):
    """
    Intelligent zero-downtime local synthesis if external API keys
    are not yet configured or experiencing external downtime.
    """
    msg = user_message.lower()
    projects = Project.objects.all()
    profile = ProfileInfo.objects.first()

    email = getattr(profile, 'email', 'usama.code404@gmail.com')
    name = getattr(profile, 'name', 'Usama Ikram')

    if any(k in msg for k in ['contact', 'email', 'phone', 'hire', 'reach']):
        return (
            f"You can reach out to {name} directly via email at {email} or connect on "
            f"LinkedIn at https://linkedin.com/in/usama-ikram-252052182. "
            f"You can also send a direct message through the Contact section right on this page!"
        )

    for p in projects:
        if p.title.lower().split()[0] in msg or (p.title.lower() in msg):
            return (
                f"**{p.title}** ({p.category}): {p.description}\n\n"
                f"• **Architecture**: {p.architecture or 'Custom modular layout'}\n"
                f"• **Tech Stack**: {', '.join(p.tags) if isinstance(p.tags, list) else p.tags}\n"
                f"• **Metrics**: {p.metrics or 'Optimized for 60fps & sub-second LCP'}\n"
                f"• **Live URL**: {p.live_url or 'Available on request'}"
            )

    if any(k in msg for k in ['skill', 'stack', 'technolog', 'react', 'tailwind', 'python', 'django']):
        return (
            f"{name} is a Principal Frontend Architect specialized in React 19, Tailwind CSS, TypeScript, "
            f"Next.js, Three.js / React Three Fiber for WebGL visual interfaces, and Django 5 REST Framework for robust backends. "
            f"He focuses on modular state management, zero layout shifts, and high-performance rendering."
        )

    if any(k in msg for k in ['who', 'about', 'bio', 'experience']):
        return (
            f"{name} is an engineer and architect based in Lahore, Pakistan, dedicated to building "
            f"production-grade web applications with modern React, Tailwind CSS, and enterprise Django APIs. "
            f"Feel free to ask about specific projects like Olyra, ZeeFrames, Dentalook, or his experience!"
        )

    return (
        f"Hi! I'm Cypher, {name}'s portfolio assistant. Feel free to ask me anything about his work, "
        f"projects like Olyra or Dentalook, technical expertise in React and Django, or how to contact him directly at {email}."
    )


def dispatch_ai_chat(user_message, history=None):
    """
    Main orchestrator:
    1. Checks semantic cache to intercept repeated questions and prevent API credit exhaustion
    2. Dynamically loads live database context
    3. Executes Primary Provider -> Fallback Provider -> Local Synthesizer
    4. Caches fresh responses tied to the active knowledge version
    """
    ai_setting, _ = AISetting.objects.get_or_create(id=1)
    if not ai_setting.is_active:
        return {
            'reply': "The AI Assistant is currently deactivated by the administrator.",
            'provider': 'system',
            'is_fallback': False,
            'is_cached': False,
        }

    # Step 1: Semantic Cache Check (Anti-API Exhaustion Engine)
    # Check if this query has already been answered for the current knowledge version
    query_hash, normalized = normalize_query(user_message)
    if ai_setting.enable_cache and len(user_message.strip()) > 2:
        cache_hit = AIResponseCache.objects.filter(
            query_hash=query_hash,
            knowledge_version=ai_setting.knowledge_version
        ).first()

        if cache_hit:
            cache_hit.hit_count += 1
            cache_hit.save(update_fields=['hit_count', 'updated_at'])
            logger.info(f"AI Cache Hit (Count: {cache_hit.hit_count}) for query: '{user_message}'")
            return {
                'reply': cache_hit.response_text,
                'provider': f"{cache_hit.provider} (cached)",
                'model': cache_hit.model,
                'is_fallback': False,
                'is_cached': True,
                'hit_count': cache_hit.hit_count,
            }

    # Step 2: Build Live Dynamic Context
    primary_key = ai_setting.primary_api_key or os.getenv(f"{ai_setting.primary_provider.upper()}_API_KEY", "")
    fallback_key = ai_setting.fallback_api_key or os.getenv(f"{ai_setting.fallback_provider.upper()}_API_KEY", "")

    system_instruction = build_system_context()
    if ai_setting.system_instruction_extra:
        system_instruction += f"\n\nAdditional Instructions:\n{ai_setting.system_instruction_extra}"

    reply_text = None
    used_provider = None
    used_model = None
    is_fallback = False

    # Step 3: Try Primary Provider
    if primary_key:
        try:
            reply_text = execute_provider_inference(
                provider=ai_setting.primary_provider,
                api_key=primary_key,
                model_name=ai_setting.primary_model,
                system_instruction=system_instruction,
                user_message=user_message,
                history=history,
                temperature=ai_setting.temperature,
            )
            used_provider = ai_setting.primary_provider
            used_model = ai_setting.primary_model
        except Exception as e:
            logger.warning(f"Primary AI Provider '{ai_setting.primary_provider}' failed: {e}. Initiating fallback sequence.")

    # Step 4: Try Fallback Provider
    if not reply_text and ai_setting.fallback_provider != 'none' and fallback_key:
        try:
            reply_text = execute_provider_inference(
                provider=ai_setting.fallback_provider,
                api_key=fallback_key,
                model_name=ai_setting.fallback_model,
                system_instruction=system_instruction,
                user_message=user_message,
                history=history,
                temperature=ai_setting.temperature,
            )
            used_provider = ai_setting.fallback_provider
            used_model = ai_setting.fallback_model
            is_fallback = True
        except Exception as e:
            logger.warning(f"Fallback AI Provider '{ai_setting.fallback_provider}' failed: {e}.")

    # Step 5: Zero-downtime local synthesis if external providers unavailable
    if not reply_text:
        reply_text = synthesize_local_context_response(user_message)
        used_provider = 'local-synthesizer'
        used_model = 'portfolio-context-v1'
        is_fallback = True

    # Step 6: Store in AIResponseCache for future repeated requests
    if ai_setting.enable_cache and reply_text:
        try:
            AIResponseCache.objects.update_or_create(
                query_hash=query_hash,
                knowledge_version=ai_setting.knowledge_version,
                defaults={
                    'normalized_query': normalized,
                    'original_query': user_message,
                    'response_text': reply_text,
                    'provider': used_provider,
                    'model': used_model or '',
                }
            )
        except Exception as e:
            logger.warning(f"Failed storing AI cache: {e}")

    return {
        'reply': reply_text,
        'provider': used_provider,
        'model': used_model,
        'is_fallback': is_fallback,
        'is_cached': False,
        'knowledge_version': ai_setting.knowledge_version,
    }


def get_cache_statistics():
    """
    Returns aggregated telemetry on saved API calls and cached questions.
    """
    total_entries = AIResponseCache.objects.count()
    total_hits = sum(AIResponseCache.objects.values_list('hit_count', flat=True)) if total_entries > 0 else 0
    saved_calls = max(0, total_hits - total_entries)
    return {
        'total_cached_queries': total_entries,
        'total_requests_served': total_hits,
        'api_calls_saved': saved_calls,
    }


def flush_ai_response_cache():
    """
    Clears all cached questions to force fresh queries across the system.
    """
    deleted_count, _ = AIResponseCache.objects.all().delete()
    return deleted_count


def synthesize_dashboard_content_fallback(field_type: str, context: dict):
    """
    Intelligent local heuristic templates when external AI inference is offline.
    """
    title = context.get('title', 'Application')
    category = context.get('category', 'Web App')
    tags = context.get('tags', 'React.js, Tailwind CSS')
    if isinstance(tags, list):
        tags = ", ".join(tags)

    if field_type == 'project_title':
        return f"{title} – Enterprise {category} Architecture"
    elif field_type == 'project_description':
        return (
            f"A modern, responsive {category.lower()} engineered with {tags}, delivering seamless "
            f"user experiences, reactive state management, and optimized asset delivery."
        )
    elif field_type == 'project_architecture':
        return "Component-driven layout with custom debounce hooks, atomic state management, and lazy route splitting."
    elif field_type == 'project_metrics':
        return "99% Lighthouse Performance, <1.1s LCP, zero layout shifts (CLS < 0.01)"
    elif field_type == 'skill_highlight':
        name = context.get('name', 'Technology')
        return f"Semantic architecture, strict typing, and high-throughput data streams with {name}"
    elif field_type == 'experience_description':
        role = context.get('role', 'Frontend Architect')
        company = context.get('company', 'Independent')
        return f"Architecting enterprise-scale applications and high-performance WebGL graphics as {role} at {company}."
    return f"Polished, production-ready content for {field_type}."


def generate_dashboard_content(field_type: str, context: dict, instruction: str = ""):
    """
    Generates high-impact titles, descriptions, architectures, and metrics
    for projects, skills, and portfolio forms.
    """
    system_instruction = (
        "You are an expert Senior Technical Copywriter and Principal Frontend Architect "
        "assisting Usama Ikram in crafting high-impact copy for his enterprise portfolio. "
        "Return ONLY the requested text without preamble, quotes, markdown code wrappers, or explanations."
    )

    title = context.get('title', '')
    category = context.get('category', 'Web App')
    tags = context.get('tags', '')
    if isinstance(tags, list):
        tags = ", ".join(tags)
    draft = context.get('draft', '')

    if field_type == 'project_title':
        prompt = (
            f"Generate a catchy, modern enterprise project title for a {category} built with {tags or 'modern React and Tailwind'}. "
            f"Current draft or idea: '{draft or title}'. Format: 'ProjectName – Concise Value Subtitle'. "
            f"Additional instruction: {instruction}"
        )
    elif field_type == 'project_description':
        prompt = (
            f"Write a polished, professional 2-3 sentence project description for a project named '{title or 'Modern Web App'}' "
            f"in category '{category}' with tech stack [{tags}]. "
            f"Highlight business value, responsiveness, and state/UI design. "
            f"Draft ideas: '{draft}'. Additional instruction: {instruction}"
        )
    elif field_type == 'project_architecture':
        prompt = (
            f"Write a 1-sentence technical architecture summary for a {category} named '{title}' built with [{tags}]. "
            f"Mention modular components, state management (e.g. Zustand/Redux/Context), and API/rendering patterns. "
            f"Draft: '{draft}'. Additional instruction: {instruction}"
        )
    elif field_type == 'project_metrics':
        prompt = (
            f"Generate realistic, impressive web performance and engineering metrics for '{title}' ({tags}). "
            f"Example format: '99% Lighthouse Accessibility, <1.1s LCP, 60fps WebGL shaders'. "
            f"Additional instruction: {instruction}"
        )
    elif field_type == 'skill_highlight':
        prompt = (
            f"Write a concise, high-impact highlight (3-6 words) for technical skill '{context.get('name', 'React')}' "
            f"demonstrating senior engineering mastery. Example: 'Async state machines, Custom hooks, Concurrent rendering'. "
            f"Draft: '{draft}'. Additional instruction: {instruction}"
        )
    elif field_type == 'experience_description':
        prompt = (
            f"Write a 2-sentence career milestone description for role '{context.get('role', 'Frontend Architect')}' "
            f"at '{context.get('company', 'Independent')}'. "
            f"Draft: '{draft}'. Additional instruction: {instruction}"
        )
    else:
        prompt = f"Write professional content for {field_type}. Context: {context}. Instruction: {instruction}"

    ai_setting, _ = AISetting.objects.get_or_create(id=1)
    primary_key = ai_setting.primary_api_key or os.getenv(f"{ai_setting.primary_provider.upper()}_API_KEY", "")
    fallback_key = ai_setting.fallback_api_key or os.getenv(f"{ai_setting.fallback_provider.upper()}_API_KEY", "")

    if primary_key:
        try:
            generated = execute_provider_inference(
                provider=ai_setting.primary_provider,
                api_key=primary_key,
                model_name=ai_setting.primary_model,
                system_instruction=system_instruction,
                user_message=prompt,
                history=None,
                temperature=0.7,
            )
            return generated.strip().strip('"').strip("'")
        except Exception as e:
            logger.warning(f"Dashboard AI generator primary failed: {e}")

    if ai_setting.fallback_provider != 'none' and fallback_key:
        try:
            generated = execute_provider_inference(
                provider=ai_setting.fallback_provider,
                api_key=fallback_key,
                model_name=ai_setting.fallback_model,
                system_instruction=system_instruction,
                user_message=prompt,
                history=None,
                temperature=0.7,
            )
            return generated.strip().strip('"').strip("'")
        except Exception as e:
            logger.warning(f"Dashboard AI generator fallback failed: {e}")

    return synthesize_dashboard_content_fallback(field_type, context)


def draft_personalized_message_reply(name: str, email: str, subject: str, message: str, tone: str = "warm_professional"):
    """
    Drafts an articulate, personalized email response from Usama Ikram to an inbound inquiry.
    """
    profile = ProfileInfo.objects.first()
    usama_name = getattr(profile, 'name', 'Usama Ikram')
    usama_title = getattr(profile, 'title', 'Principal Frontend Architect & Web Engineer')
    usama_email = getattr(profile, 'email', 'usama.code404@gmail.com')
    usama_phone = getattr(profile, 'phone', '+92 309 8525906')

    system_instruction = (
        f"You are Usama Ikram ({usama_title}), writing a personalized, polite, and enthusiastic "
        f"email reply to an inbound contact message from your portfolio website. "
        f"Format as an email body ready to be sent. Include greeting and professional signature."
    )

    prompt = f"""
Inbound message details:
- Sender Name: {name}
- Sender Email: {email}
- Subject: {subject}
- Inbound Message: "{message}"

Instructions:
1. Greet {name.split()[0] if name else 'there'} warmly.
2. Directly reference and acknowledge the key points of their message.
3. Express genuine interest in collaborating or discussing their requirements.
4. Mention that you would love to schedule a quick 15-minute intro call or exchange more details over email.
5. Sign off professionally as {usama_name} ({usama_title}), mentioning your email ({usama_email}) and phone ({usama_phone}).
"""

    ai_setting, _ = AISetting.objects.get_or_create(id=1)
    primary_key = ai_setting.primary_api_key or os.getenv(f"{ai_setting.primary_provider.upper()}_API_KEY", "")
    fallback_key = ai_setting.fallback_api_key or os.getenv(f"{ai_setting.fallback_provider.upper()}_API_KEY", "")

    if primary_key:
        try:
            return execute_provider_inference(
                provider=ai_setting.primary_provider,
                api_key=primary_key,
                model_name=ai_setting.primary_model,
                system_instruction=system_instruction,
                user_message=prompt,
                history=None,
                temperature=0.6,
            )
        except Exception as e:
            logger.warning(f"Draft reply primary failed: {e}")

    if ai_setting.fallback_provider != 'none' and fallback_key:
        try:
            return execute_provider_inference(
                provider=ai_setting.fallback_provider,
                api_key=fallback_key,
                model_name=ai_setting.fallback_model,
                system_instruction=system_instruction,
                user_message=prompt,
                history=None,
                temperature=0.6,
            )
        except Exception as e:
            logger.warning(f"Draft reply fallback failed: {e}")

    # Fallback template
    first_name = name.split()[0] if name else "there"
    return f"""Hi {first_name},

Thank you for reaching out through my portfolio website regarding "{subject or 'your inquiry'}"!

I have reviewed your message: "{message.strip()[:180]}..."
I would be delighted to discuss how we can collaborate and bring this to life. My background specializes in engineering scalable, high-performance web applications with React 19, Tailwind CSS, and robust backend architectures.

Would you be open to a brief 15-minute introductory call this week to discuss your project scope and timelines? Alternatively, feel free to reply directly to this email ({usama_email}) or message me on WhatsApp at {usama_phone}.

Looking forward to speaking with you!

Warm regards,
{usama_name}
{usama_title}
Email: {usama_email} | Phone: {usama_phone}
Portfolio: https://github.com/chusamaikram"""


def analyze_inbox_messages():
    """
    Scans ContactMessage inbox, identifies unread messages, categorizes intent,
    and surfaces actionable recommendations for Usama.
    """
    from portfolio.models import ContactMessage
    messages = ContactMessage.objects.all().order_by('-created_at')
    unread = messages.filter(is_read=False)

    summary_list = []
    needs_reply_count = 0

    for m in messages:
        content_lower = m.message.lower()
        subject_lower = m.subject.lower()
        text = f"{subject_lower} {content_lower}"

        if any(k in text for k in ['contract', 'hire', 'project', 'dashboard', 'budget', 'proposal', 'rate', 'timeline', 'freelance']):
            category = 'Client Project / Contract'
            priority = 'HIGH'
            needs_reply = True
        elif any(k in text for k in ['interview', 'job', 'position', 'role', 'team', 'salary', 'offer']):
            category = 'Employment / Job Opportunity'
            priority = 'HIGH'
            needs_reply = True
        elif any(k in text for k in ['collab', 'partner', 'consult', 'help']):
            category = 'Collaboration / Inquiry'
            priority = 'MEDIUM'
            needs_reply = True
        else:
            category = 'Feedback / General Note'
            priority = 'LOW'
            needs_reply = not m.is_read

        if needs_reply:
            needs_reply_count += 1

        summary_list.append({
            'id': m.id,
            'name': m.name,
            'email': m.email,
            'subject': m.subject,
            'snippet': m.message[:120] + ('...' if len(m.message) > 120 else ''),
            'is_read': m.is_read,
            'category': category,
            'priority': priority,
            'needs_reply': needs_reply,
            'created_at': m.created_at.isoformat(),
        })

    return {
        'total_messages': messages.count(),
        'unread_count': unread.count(),
        'needs_reply_count': needs_reply_count,
        'messages': summary_list,
        'summary': f"You have {unread.count()} unread message(s) and {needs_reply_count} message(s) flagged for priority response.",
    }

