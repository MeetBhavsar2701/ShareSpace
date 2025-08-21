import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Conversation
import logging

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
            self.room_group_name = f"chat_{self.conversation_id}"
            
            print(f"Attempting to connect to conversation {self.conversation_id}")
            print(f"User in scope: {self.scope['user']}")
            print(f"User authenticated: {self.scope['user'].is_authenticated}")

            if not self.scope["user"].is_authenticated:
                print("Connection rejected: User not authenticated.")
                await self.close()
                return

            print(f"User ID from token: {self.scope['user'].id}")
            
            # ✅ FIX HERE
            is_participant = await self.check_if_participant()
            if not is_participant:
                print(f"Connection rejected: User {self.scope['user'].username} is not a participant.")
                await self.close()
                return
            
            print(f"User {self.scope['user'].username} is authenticated and a participant. Accepting connection...")

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            print(f"WebSocket connection accepted for conversation {self.conversation_id}")
            
        except Exception as e:
            print(f"Error in connect: {str(e)}")
            logger.error(f"WebSocket connection error: {str(e)}")
            await self.close()


    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            # Note: self.scope['user'] might be AnonymousUser here.
            print(f"User disconnected from conversation {self.conversation_id}")
        except Exception as e:
            print(f"Error in disconnect: {str(e)}")

    async def receive(self, text_data):
        try:
            print(f"Received message from {self.scope['user'].username}: {text_data}")
            data = json.loads(text_data)
            message_text = data.get('message')
            
            if not message_text:
                return

            sender = self.scope["user"]
            
            await self.save_message(sender, message_text)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message_text,
                    "sender_id": str(sender.id),
                    "sender_username": sender.username,
                }
            )
        except Exception as e:
            print(f"Error in receive: {str(e)}")
            logger.error(f"Error processing message: {str(e)}")

    async def chat_message(self, event):
        try:
            await self.send(text_data=json.dumps({
                "message": event["message"],
                "sender_id": event["sender_id"],
                "sender_username": event["sender_username"],
            }))
        except Exception as e:
            print(f"Error in chat_message: {str(e)}")

    @sync_to_async
    def check_if_participant(self):
        user = self.scope["user"]
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            print(f"Checking if user {user.id} is a participant in conversation {self.conversation_id}")
            # Use user IDs for reliable comparison
            is_part = str(user.id) == str(conversation.user_a.id) or str(user.id) == str(conversation.user_b.id)
            print(f"Comparison result: {is_part}. User A ID: {conversation.user_a.id}, User B ID: {conversation.user_b.id}")
            return is_part
        except Conversation.DoesNotExist:
            print(f"Conversation {self.conversation_id} not found in database.")
            return False
        except Exception as e:
            print(f"Error checking participant: {str(e)}")
            return False

    @sync_to_async
    def save_message(self, sender, message_text):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            Message.objects.create(
                conversation=conversation,
                sender=sender,
                text=message_text,
            )
        except Conversation.DoesNotExist:
            logger.error(f"Conversation {self.conversation_id} not found.")
            return
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")
            return