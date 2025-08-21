from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Conversation(models.Model):
    # a 1-1 chat between two users; you can extend to group later
    user_a = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations_a")
    user_b = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations_b")
    created_at = models.DateTimeField(auto_now_add=True)

    def participants(self):
        return {self.user_a_id, self.user_b_id}

    def __str__(self):
        return f"Conversation({self.id}) {self.user_a_id} <-> {self.user_b_id}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_chat_messages")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
