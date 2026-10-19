from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .health import HealthCheckView

urlpatterns = [
    # Production Healthcheck Endpoints (Render, Fly.io, Railway, UptimeRobot)
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('healthz', HealthCheckView.as_view(), name='healthz_check'),
    path('ping/', HealthCheckView.as_view(), name='ping_check'),
    path('api/v1/health/', HealthCheckView.as_view(), name='api_v1_health_check'),

    # Admin Panel
    path('admin/', admin.site.urls),

    # Versioned API Endpoints
    path('api/v1/auth/', include('authentication.urls')),
    path('api/v1/portfolio/', include('portfolio.urls')),
    path('api/v1/ai/', include('ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
