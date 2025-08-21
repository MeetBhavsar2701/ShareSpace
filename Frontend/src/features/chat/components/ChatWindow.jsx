// Frontend/src/features/chat/components/ChatWindow.jsx

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";
import api from "@/api";
import { useAuth } from "@/features/authentication/AuthContext";

export function ChatWindow({ conversationId, conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const getOtherUser = (convo) => {
    if (!user || !convo) return null;
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

    const token = sessionStorage.getItem("access_token");
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setIsSocketReady(true);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const isMyMessage = data.sender_id === user.id;
      setMessages((prev) => [...prev, { text: data.message, sender: isMyMessage ? "me" : "other", sender_id: data.sender_id, created_at: data.created_at }]);
    };
    ws.onclose = () => setIsSocketReady(false);
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
          created_at: msg.created_at
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
      }
    };
  }, [conversationId, user]);

  const sendMessage = () => {
    if (isSocketReady && input.trim()) {
      socketRef.current.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Improved initial state for desktop view
  if (!conversation) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center bg-gray-50/50 text-muted-foreground">
        <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold">Select a conversation</h2>
        <p>Choose a chat from the list to start messaging.</p>
      </div>
    );
  }

  const otherUser = getOtherUser(conversation);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* --- IMPROVED HEADER --- */}
      <div className="border-b p-4 flex items-center gap-4 bg-gray-50/75">
        {/* Back button for mobile */}
        <Button onClick={onBack} variant="ghost" size="icon" className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link to={`/users/${otherUser?.id}`} className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.avatar_url} alt={otherUser?.username} />
            <AvatarFallback>{otherUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold text-lg text-gray-800">{otherUser?.username}</h2>
        </Link>
      </div>

      {/* --- IMPROVED MESSAGES AREA --- */}
      <div className="flex-grow p-6 space-y-6 overflow-y-auto bg-gray-50/25">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            {msg.sender !== "me" && (
              <Link to={`/users/${otherUser?.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser?.avatar_url} />
                  <AvatarFallback>{otherUser?.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className={`p-3 max-w-md rounded-2xl shadow-sm ${msg.sender === "me" ? "bg-emerald-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 text-right ${msg.sender === 'me' ? 'text-emerald-200' : 'text-gray-400'}`}>{formatTimestamp(msg.created_at)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- IMPROVED INPUT AREA --- */}
      <div className="border-t p-4 flex gap-2 bg-gray-50">
        <Input
          type="text"
          className="flex h-10 w-full rounded-full border bg-white px-4 py-2 text-sm focus-visible:ring-emerald-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isSocketReady}
        />
        <Button
          onClick={sendMessage}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
          size="icon"
          disabled={!isSocketReady || !input.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}