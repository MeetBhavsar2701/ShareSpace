import asyncio
import websockets
import json

async def test_websocket():
    # Test URL with valid token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NzM2NDM3LCJpYXQiOjE3NTU3MzYxMzcsImp0aSI6ImYwOWMzYjQ3MDFiODQxZDliMjdkMjMwMTMxYTFlODM3IiwidXNlcl9pZCI6IjU3NjU5NDdkLWE2NjQtNDA3Ny1hMTcyLTFhYTMzYjYyNTMwYSIsInVzZXJuYW1lIjoiTWVldDI3In0.9O5wmJ-rMvIWVAdtAYL5dGMvyxqbwc_5GE5xG9KqTr8"
    uri = f"ws://127.0.0.1:8000/ws/chat/1/?token={token}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket!")
            
            # Send a test message
            message = {"message": "Hello from test script"}
            await websocket.send(json.dumps(message))
            print(f"Sent message: {message}")
            
            # Wait for response
            response = await websocket.recv()
            print(f"Received: {response}")
            
    except Exception as e:
        print(f"WebSocket connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
