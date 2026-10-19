from rest_framework import serializers
from .models import AISetting, AIKnowledgeItem
from .services import get_cache_statistics


class AISettingSerializer(serializers.ModelSerializer):
    """
    Serializer for managing AI Provider integrations, fallback settings,
    and anti-credit-exhaustion caching telemetry.
    """
    class Meta:
        model = AISetting
        fields = [
            'id',
            'primary_provider',
            'primary_model',
            'primary_api_key',
            'fallback_provider',
            'fallback_model',
            'fallback_api_key',
            'temperature',
            'system_instruction_extra',
            'is_active',
            'knowledge_version',
            'enable_cache',
            'updated_at',
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Mask keys partially for UI security display while still allowing updates
        if ret.get('primary_api_key'):
            key = ret['primary_api_key']
            ret['primary_api_key_masked'] = f"{key[:4]}...{key[-4:]}" if len(key) > 8 else "********"
        if ret.get('fallback_api_key'):
            key = ret['fallback_api_key']
            ret['fallback_api_key_masked'] = f"{key[:4]}...{key[-4:]}" if len(key) > 8 else "********"

        # Attach real-time cache savings metrics
        ret['cache_stats'] = get_cache_statistics()
        return ret


class AIChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, max_length=2000)
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )


class AITestConnectionSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['gemini', 'groq', 'openai'])
    api_key = serializers.CharField(required=False, allow_blank=True)
    model = serializers.CharField(required=False, allow_blank=True)


class AIKnowledgeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIKnowledgeItem
        fields = ['id', 'topic', 'content', 'is_active', 'created_at', 'updated_at']
