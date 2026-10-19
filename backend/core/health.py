import time
from datetime import datetime, timezone
from django.db import connection
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

SERVER_START_TIME = time.time()


class HealthCheckView(APIView):
    """
    Production-grade Health Check Endpoint for Render, Railway, Fly.io, or Uptime monitors.
    Routes:
      - GET /health/
      - GET /healthz
      - GET /ping/
      - GET /api/v1/health/
    """
    permission_classes = [AllowAny]
    throttle_classes = []  # Explicitly unthrottled for automated health checks

    def get(self, request, *args, **kwargs):
        # 1. Verify Database Connectivity
        db_status = "ok"
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"

        # 2. Compute Service Metrics
        uptime_seconds = int(time.time() - SERVER_START_TIME)
        is_healthy = db_status == "ok"
        status_code = 200 if is_healthy else 503

        payload = {
            "status": "healthy" if is_healthy else "degraded",
            "service": "portfolio-backend",
            "environment": "production" if not request.get_host().startswith(("127.0.0.1", "localhost")) else "development",
            "database": db_status,
            "uptime_seconds": uptime_seconds,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "1.0.0",
        }

        return JsonResponse(payload, status=status_code)
