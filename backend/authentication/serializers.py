from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Public admin user profile serializer
    """
    role = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'name',
            'role',
            'is_staff',
            'is_superuser',
        ]
        read_only_fields = fields

    def get_role(self, obj):
        if obj.is_superuser:
            return 'Principal Architect & Admin'
        if obj.is_staff:
            return 'Staff'
        return 'User'

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends TokenObtainPairSerializer to include user details in the token response
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        return data
