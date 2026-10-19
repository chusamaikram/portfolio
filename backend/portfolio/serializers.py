from rest_framework import serializers
from .models import (
    Project,
    SkillCategory,
    Skill,
    Testimonial,
    Experience,
    ContactMessage,
    ProfileInfo,
)


class ProjectSerializer(serializers.ModelSerializer):
    liveUrl = serializers.CharField(source='live_url', required=False, allow_blank=True)
    githubUrl = serializers.CharField(source='github_url', required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'image',
            'tags',
            'live_url',
            'github_url',
            'liveUrl',
            'githubUrl',
            'featured',
            'category',
            'architecture',
            'metrics',
            'order',
            'created_at',
            'updated_at',
        ]

    def to_internal_value(self, data):
        # Support incoming liveUrl/githubUrl camelCase keys
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'liveUrl' in data and 'live_url' not in data:
            data['live_url'] = data.get('liveUrl')
        if 'githubUrl' in data and 'github_url' not in data:
            data['github_url'] = data.get('githubUrl')
        return super().to_internal_value(data)


class SkillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'icon', 'highlight', 'order']


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillItemSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'order', 'skills']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'name',
            'role',
            'company',
            'content',
            'rating',
            'avatar',
            'visible',
            'date',
            'created_at',
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id',
            'role',
            'company',
            'period',
            'description',
            'tags',
            'order',
            'created_at',
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    isRead = serializers.BooleanField(source='is_read', required=False)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'name',
            'email',
            'subject',
            'message',
            'is_read',
            'isRead',
            'timestamp',
            'created_at',
        ]

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'isRead' in data and 'is_read' not in data:
            data['is_read'] = data.get('isRead')
        return super().to_internal_value(data)


class ProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileInfo
        fields = '__all__'
