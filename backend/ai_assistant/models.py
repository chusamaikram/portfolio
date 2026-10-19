from django.db import models


class AISetting(models.Model):
    """
    Dynamic AI provider configurations persisted in the database,
    modifiable in real-time from the React Admin Dashboard.
    """
    PROVIDER_CHOICES = [
        ('gemini', 'Google Gemini'),
        ('groq', 'Groq Cloud'),
        ('openai', 'OpenAI'),
    ]

    FALLBACK_CHOICES = [
        ('none', 'No Fallback'),
        ('gemini', 'Google Gemini'),
        ('groq', 'Groq Cloud'),
        ('openai', 'OpenAI'),
    ]

    # Primary Provider Configuration
    primary_provider = models.CharField(
        max_length=50,
        choices=PROVIDER_CHOICES,
        default='gemini',
        help_text="Primary AI inference engine"
    )
    primary_model = models.CharField(
        max_length=100,
        default='gemini-2.5-flash',
        help_text="Model identifier (e.g. gemini-2.5-flash, llama-3.3-70b-versatile, gpt-4o-mini)"
    )
    primary_api_key = models.CharField(
        max_length=350,
        blank=True,
        help_text="API key for primary provider"
    )

    # Fallback Provider Configuration
    fallback_provider = models.CharField(
        max_length=50,
        choices=FALLBACK_CHOICES,
        default='groq',
        help_text="Automated failover engine if primary exhausts quotas or times out"
    )
    fallback_model = models.CharField(
        max_length=100,
        default='llama-3.3-70b-versatile',
        help_text="Fallback model identifier"
    )
    fallback_api_key = models.CharField(
        max_length=350,
        blank=True,
        help_text="API key for fallback provider"
    )

    # Inference Hyperparameters & Tone
    temperature = models.FloatField(
        default=0.7,
        help_text="Sampling temperature between 0.0 and 1.0"
    )
    system_instruction_extra = models.TextField(
        blank=True,
        default='',
        help_text="Custom system instructions or personality adjustments"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Toggle AI assistant on/off globally"
    )

    # Knowledge Versioning & Auto-Cache Invalidation
    knowledge_version = models.IntegerField(
        default=1,
        help_text="Monotonically increasing counter incremented when portfolio items change to invalidate stale caches"
    )
    enable_cache = models.BooleanField(
        default=True,
        help_text="Cache recurring user questions to prevent hitting API limits"
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Settings: {self.primary_provider} ({self.primary_model}) -> Fallback: {self.fallback_provider} (v{self.knowledge_version})"


class AIResponseCache(models.Model):
    """
    Normalized semantic response cache to prevent redundant LLM inference calls,
    saving API credits and speeding up response latency to <15ms.
    """
    query_hash = models.CharField(max_length=64, db_index=True)
    normalized_query = models.TextField()
    original_query = models.TextField()
    response_text = models.TextField()
    provider = models.CharField(max_length=50)
    model = models.CharField(max_length=100, blank=True)
    knowledge_version = models.IntegerField(default=1, db_index=True)
    hit_count = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-hit_count', '-updated_at']

    def __str__(self):
        return f"[{self.hit_count} hits] {self.normalized_query[:60]} -> {self.provider}"


class AIKnowledgeItem(models.Model):
    """
    Continuous knowledge memory item: allows storing specialized insights,
    custom FAQs, interview notes, or technical achievements that the AI
    learns and retains across sessions.
    """
    topic = models.CharField(max_length=200)
    content = models.TextField(help_text="Key knowledge, achievements, or context notes")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Knowledge: {self.topic}"
