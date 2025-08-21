import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import api from "@/api";
import { useAuth } from "@/features/authentication/AuthContext";

export function ChatWindow({ conversationId, conversation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false); // NEW STATE VARIABLE

  const getOtherUser = (convo) => {
    if (!user) return null;
    return convo.user_a.id == user.id ? convo.user_b : convo.user_a;
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setMessages([]);
      setIsSocketReady(false);
      return;
    }

    console.log("Attempting to connect WebSocket...");

    const token = sessionStorage.getItem("access_token");
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected successfully.");
      setIsSocketReady(true);
      if (inputRef.current && typeof inputRef.current.focus === "function") {
        inputRef.current.focus();
      }
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Message received from server:", data);
      const isMyMessage = data.sender_id === user.id;
      setMessages((prev) => [...prev, { text: data.message, sender: isMyMessage ? "me" : "other", sender_id: data.sender_id }]);
    };
    
    ws.onclose = (e) => {
      console.log("WebSocket disconnected.", e);
      setIsSocketReady(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsSocketReady(false);
    };

    socketRef.current = ws;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${conversationId}/messages/`);
        const formattedMessages = response.data.map(msg => ({
          text: msg.text,
          sender: msg.sender.id === user.id ? "me" : "other",
          sender_id: msg.sender.id,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket connection cleaned up.");
      }
    };
  }, [conversationId, user]);

  const sendMessage = () => {
    console.log("Attempting to send message. Current input:", input);
    if (isSocketReady && input.trim()) { 
      socketRef.current.send(JSON.stringify({ message: input }));
      setInput("");
      console.log("Message sent successfully.");
    } else {
        console.log("Could not send message. Socket not ready or input is empty.");
    }
  };

  if (!conversation) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Select a conversation to start chatting.</div>;
  }
  
  const otherUser = getOtherUser(conversation);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={otherUser?.avatar_url} />
          <AvatarFallback>{otherUser?.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-lg">{otherUser?.username}</h2>
      </div>

      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "items-start gap-2"}`}>
            {msg.sender !== "me" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherUser?.avatar_url} />
                <AvatarFallback>{otherUser?.username.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className={`${msg.sender === "me" ? "bg-emerald-600 text-white rounded-lg rounded-br-none" : "bg-gray-100 rounded-lg rounded-bl-none"} p-3 max-w-xs`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isSocketReady}
        />
        <Button onClick={sendMessage} className="bg-emerald-600 hover:bg-emerald-700" disabled={!isSocketReady || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}