from django.urls import path
from .views import (
    AIChatView,
    AISettingView,
    AITestConnectionView,
    AICacheFlushView,
    AICacheStatsView,
    AIDashboardGenerateView,
    AIInboxAnalysisView,
    AIDraftReplyView,
)

app_name = 'ai_assistant'

urlpatterns = [
    # Public Client Chat with Semantic Cache
    path('chat/', AIChatView.as_view(), name='ai_chat'),

    # Admin Provider Settings & Connectivity Ping
    path('settings/', AISettingView.as_view(), name='ai_settings'),
    path('test/', AITestConnectionView.as_view(), name='ai_test_connection'),

    # Semantic Cache Management
    path('cache/flush/', AICacheFlushView.as_view(), name='ai_cache_flush'),
    path('cache/stats/', AICacheStatsView.as_view(), name='ai_cache_stats'),

    # Dashboard AI Copilot: Form Generation & Inbox Assistant
    path('copilot/generate/', AIDashboardGenerateView.as_view(), name='ai_copilot_generate'),
    path('copilot/inbox-analysis/', AIInboxAnalysisView.as_view(), name='ai_copilot_inbox_analysis'),
    path('copilot/draft-reply/', AIDraftReplyView.as_view(), name='ai_copilot_draft_reply'),
]
