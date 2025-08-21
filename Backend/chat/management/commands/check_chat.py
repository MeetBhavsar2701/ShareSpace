from django.core.management.base import BaseCommand
from chat.models import Conversation
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Check chat database and create test conversation if needed'

    def handle(self, *args, **options):
        # Check if there are any conversations
        conversations = Conversation.objects.all()
        self.stdout.write(f"Found {conversations.count()} conversations")
        
        for conv in conversations:
            self.stdout.write(f"Conversation {conv.id}: {conv.user_a.username} <-> {conv.user_b.username}")
        
        # Check if there are any users
        users = CustomUser.objects.all()
        self.stdout.write(f"Found {users.count()} users")
        
        for user in users:
            self.stdout.write(f"User {user.id}: {user.username}")
        
        # Create a test conversation if none exist and we have at least 2 users
        if conversations.count() == 0 and users.count() >= 2:
            user1 = users.first()
            user2 = users.last()
            conv = Conversation.objects.create(user_a=user1, user_b=user2)
            self.stdout.write(f"Created test conversation {conv.id} between {user1.username} and {user2.username}")
        elif conversations.count() == 0:
            self.stdout.write("No conversations found and not enough users to create one")

