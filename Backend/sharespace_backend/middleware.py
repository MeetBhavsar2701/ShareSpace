# sharespace_backend/middleware.py
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs
from users.models import CustomUser
from asgiref.sync import sync_to_async

def JWTAuthMiddlewareStack(inner):
    async def middleware(scope, receive, send):
        close_old_connections()
        try:
            query_string = parse_qs(scope["query_string"].decode())
            token_key = query_string.get("token")
            if token_key:
                token = AccessToken(token_key[0])
                user_id = token["user_id"]
                user = await sync_to_async(CustomUser.objects.get)(id=user_id)
                scope["user"] = user
                print(f"Authenticated user for WebSocket: {user.username}")
            else:
                scope["user"] = AnonymousUser()
        except (InvalidToken, TokenError, CustomUser.DoesNotExist):
            scope["user"] = AnonymousUser()
            print("Failed to authenticate user from token.")
        
        # This is the crucial part: pass control to the inner application
        return await inner(scope, receive, send)
    return middleware