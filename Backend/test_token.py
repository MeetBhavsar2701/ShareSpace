import os
import django
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sharespace_backend.settings')
django.setup()

from rest_framework_simplejwt.tokens import AccessToken
from users.models import CustomUser

def generate_test_token():
    # Get the first user (Meet27 from conversation 1)
    try:
        user = CustomUser.objects.get(username='Meet27')
        print(f"Found user: {user.username} with ID: {user.id}")
        
        # Generate a token
        token = AccessToken()
        token['user_id'] = str(user.id)
        token['username'] = user.username
        
        # Set expiration to 5 minutes from now
        from datetime import datetime, timedelta
        token.set_exp(lifetime=timedelta(minutes=5))
        
        token_string = str(token)
        print(f"Generated token: {token_string}")
        
        # Test the token
        decoded_token = AccessToken(token_string)
        print(f"Token is valid. User ID: {decoded_token['user_id']}")
        
        return token_string
        
    except CustomUser.DoesNotExist:
        print("User 'Meet27' not found")
        return None

if __name__ == "__main__":
    token = generate_test_token()
    if token:
        print(f"\nUse this token for WebSocket testing:")
        print(f"ws://127.0.0.1:8000/ws/chat/1/?token={token}")

