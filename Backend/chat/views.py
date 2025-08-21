from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from users.models import CustomUser

class CreateConversationView(generics.CreateAPIView):
    """
    API endpoint to create a new conversation.
    """
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # We need to manually check for an existing conversation before creating a new one.
        user_b_id = request.data.get('user_b_id')
        user_a = request.user

        if not user_b_id:
            return Response({"error": "User ID for new conversation is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_b = CustomUser.objects.get(id=user_b_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        existing_conversation = Conversation.objects.filter(
            Q(user_a=user_a, user_b=user_b) | Q(user_a=user_b, user_b=user_a)
        ).first()

        if existing_conversation:
            serializer = self.get_serializer(existing_conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If no conversation exists, proceed with the default creation process
        return super().create(request, *args, **kwargs)

class MyConversationsView(generics.ListAPIView):
    """
    API endpoint to list all conversations for the authenticated user.
    """
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(user_a=user) | Q(user_b=user)).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ConversationMessagesView(generics.ListAPIView):
    """
    API endpoint to list messages for a specific conversation.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        user = self.request.user
        
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Message.objects.none()

        # Ensure the user is a participant of the conversation
        if user not in [conversation.user_a, conversation.user_b]:
            return Message.objects.none()
            
        return conversation.messages.all().order_by('created_at')