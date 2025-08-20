from rest_framework import serializers
from .models import CustomUser

class LoginSerializer(serializers.Serializer):
    """
    Validates username and password for the login endpoint.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    """
    Handles new user registration and fetching user data.
    """
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        # 'budget' has been removed from initial signup for a better user flow.
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'avatar_url',
            'city', 'cleanliness', 'sleep_schedule', 'noise_level', 'guest_frequency', 
            'social_level', 'smoking', 'has_pets', 'gender_preference', 
            'work_schedule', 'occupation', 'mbti_type'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'avatar_url': {'read_only': True},
        }
        
    def get_avatar_url(self, obj):
        # CloudinaryField's .url attribute already provides the full absolute URL.
        if obj.avatar:
            return obj.avatar.url
        return None

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Handles updates (PATCH requests) to a user's profile.
    """
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'first_name', 'last_name', 'email', 'avatar', 'avatar_url', 'city',
            'cleanliness', 'sleep_schedule', 'noise_level', 'guest_frequency',
            'social_level', 'smoking', 'has_pets', 'gender_preference',
            'work_schedule', 'occupation', 'mbti_type', 'budget'
        )
        
    def get_avatar_url(self, obj):
    # CloudinaryField's .url attribute already provides the full absolute URL.
        if obj.avatar:
            return obj.avatar.url
        return None