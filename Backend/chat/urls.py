from django.urls import path
from .views import MyConversationsView, ConversationMessagesView, CreateConversationView

urlpatterns = [
    path("create/", CreateConversationView.as_view(), name="create-conversation"),
    path("my/", MyConversationsView.as_view(), name="my-conversations"),
    path("<int:conversation_id>/messages/", ConversationMessagesView.as_view(), name="conversation-messages"),
]