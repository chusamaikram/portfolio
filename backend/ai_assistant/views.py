from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import AnonRateThrottle

from .models import AISetting
from .serializers import (
    AISettingSerializer,
    AIChatRequestSerializer,
    AITestConnectionSerializer,
)
from .services import (
    dispatch_ai_chat,
    test_provider_connection,
    get_cache_statistics,
    flush_ai_response_cache,
)


class AIChatThrottle(AnonRateThrottle):
    scope = 'ai_chat'


class AIChatView(APIView):
    """
    Public AI Assistant Chat Endpoint:
    POST /api/v1/ai/chat/
    Accessible to guest visitors with rate throttling.
    Intercepts repeated duplicate questions via semantic caching (saving API limits)
    and dynamically injects live portfolio database context.
    """
    permission_classes = [AllowAny]
    throttle_classes = [AIChatThrottle]

    def post(self, request):
        serializer = AIChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data['message']
        history = serializer.validated_data.get('history', [])

        result = dispatch_ai_chat(user_message=message, history=history)
        return Response(result, status=status.HTTP_200_OK)


class AISettingView(APIView):
    """
    AI Integration Settings Endpoint (Admin Only):
    GET /api/v1/ai/settings/
    PUT /api/v1/ai/settings/
    Configures providers, models, API keys, failover, caching, and knowledge versioning.
    """
    permission_classes = [IsAdminUser]

    def get_setting(self):
        setting, _ = AISetting.objects.get_or_create(id=1)
        return setting

    def get(self, request):
        setting = self.get_setting()
        serializer = AISettingSerializer(setting)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        setting = self.get_setting()
        serializer = AISettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AITestConnectionView(APIView):
    """
    Live API Key & Provider Ping Test (Admin Only):
    POST /api/v1/ai/test/
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AITestConnectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        provider = serializer.validated_data['provider']
        model = serializer.validated_data.get('model')
        api_key = serializer.validated_data.get('api_key')

        if not api_key:
            setting, _ = AISetting.objects.get_or_create(id=1)
            if provider == setting.primary_provider:
                api_key = setting.primary_api_key
            elif provider == setting.fallback_provider:
                api_key = setting.fallback_api_key

        if not api_key:
            return Response(
                {'success': False, 'error': f"No API key provided or found for {provider}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = test_provider_connection(provider, api_key, model)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'provider': provider,
                    'error': str(e),
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class AICacheFlushView(APIView):
    """
    Clears all cached questions to force fresh LLM inference (Admin Only):
    POST /api/v1/ai/cache/flush/
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        deleted_count = flush_ai_response_cache()
        return Response({
            'success': True,
            'flushed_count': deleted_count,
            'message': f"Flushed {deleted_count} cached AI responses.",
        }, status=status.HTTP_200_OK)


class AICacheStatsView(APIView):
    """
    Returns live statistics on cached queries and API calls saved:
    GET /api/v1/ai/cache/stats/
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = get_cache_statistics()
        return Response(stats, status=status.HTTP_200_OK)


class AIDashboardGenerateView(APIView):
    """
    AI Copilot Form Assistant (Admin Only):
    POST /api/v1/ai/copilot/generate/
    Generates or polishes project titles, descriptions, architectures, metrics, and skill highlights.
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        field_type = request.data.get('field_type')
        context = request.data.get('context', {})
        instruction = request.data.get('instruction', '')

        if not field_type:
            return Response(
                {'error': "field_type is required (e.g. 'project_title', 'project_description', 'project_architecture', 'project_metrics')"},
                status=status.HTTP_400_BAD_REQUEST
            )

        from .services import generate_dashboard_content
        text = generate_dashboard_content(field_type, context, instruction)
        return Response({
            'field_type': field_type,
            'generated_text': text,
        }, status=status.HTTP_200_OK)


class AIInboxAnalysisView(APIView):
    """
    AI Inbound Copilot (Admin Only):
    GET /api/v1/ai/copilot/inbox-analysis/
    Categorizes messages, identifies unread inquiries, and flags messages needing replies.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        from .services import analyze_inbox_messages
        insights = analyze_inbox_messages()
        return Response(insights, status=status.HTTP_200_OK)


class AIDraftReplyView(APIView):
    """
    AI Personalized Email Reply Drafter (Admin Only):
    POST /api/v1/ai/copilot/draft-reply/
    Generates an articulate, tailored email reply to an inbound contact inquiry.
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        message_id = request.data.get('message_id')
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message_content = request.data.get('message')
        tone = request.data.get('tone', 'warm_professional')

        if message_id:
            from portfolio.models import ContactMessage
            try:
                msg = ContactMessage.objects.get(id=message_id)
                name = name or msg.name
                email = email or msg.email
                subject = subject or msg.subject
                message_content = message_content or msg.message
            except ContactMessage.DoesNotExist:
                return Response({'error': f"Message with id {message_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        if not message_content:
            return Response({'error': "Message text is required to draft a personalized reply."}, status=status.HTTP_400_BAD_REQUEST)

        from .services import draft_personalized_message_reply
        import urllib.parse

        reply_body = draft_personalized_message_reply(name or 'Friend', email or '', subject or 'Inquiry', message_content, tone)
        re_subject = f"Re: {subject}" if subject and not subject.startswith('Re:') else (subject or "Regarding your message")

        # Pre-construct mailto URI for 1-click email client dispatch
        mailto_params = urllib.parse.urlencode({
            'subject': re_subject,
            'body': reply_body,
        })
        mailto_url = f"mailto:{email or ''}?{mailto_params}"

        return Response({
            'name': name,
            'email': email,
            'subject': re_subject,
            'reply_body': reply_body,
            'mailto_url': mailto_url,
        }, status=status.HTTP_200_OK)

