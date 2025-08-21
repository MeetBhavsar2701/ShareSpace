from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import UserSerializer # Import the UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True) # Use UserSerializer for sender info

    class Meta:
        model = Message
        fields = ["id", "text", "sender", "created_at", "is_read", "conversation"]

class ConversationSerializer(serializers.ModelSerializer):
    # Use UserSerializer for participants
    user_a = UserSerializer(read_only=True)
    user_b = UserSerializer(read_only=True)
    
    # Add a write-only field for the other user's ID to be used during creation
    user_b_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "user_a", "user_b", "user_b_id", "created_at"]
        read_only_fields = ["user_a", "user_b"]
    
    def create(self, validated_data):
        user_b_id = validated_data.pop('user_b_id')
        user_a = self.context['request'].user
        user_b = self.Meta.model.user_b.field.related_model.objects.get(id=user_b_id)
        conversation = Conversation.objects.create(user_a=user_a, user_b=user_b)
        return conversation