import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import { Header } from "@/components/Header";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";
import api from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/features/authentication/AuthContext";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams(); // Hook to read URL query parameters

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/chat/my/");
        setConversations(response.data);
        
        // --- FIX: Read conversation ID from URL query and select it ---
        const urlConvoId = searchParams.get('conversationId');
        if (urlConvoId) {
          setSelectedConversationId(urlConvoId);
        } else if (response.data.length > 0) {
          setSelectedConversationId(response.data[0].id);
        }
      } catch (error) {
        toast.error("Failed to load conversations.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchConversations();
    }
  }, [user, authLoading, searchParams]); // Add searchParams to dependencies

  const selectedConversation = conversations.find(c => c.id == selectedConversationId);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-4rem)]">
        {loading || authLoading ? (
          <div className="md:col-span-1 lg:col-span-1 flex items-center justify-center">Loading...</div>
        ) : (
          <div className="md:col-span-1 lg:col-span-1 h-full">
            <ConversationList conversations={conversations} onSelectConversation={setSelectedConversationId} />
          </div>
        )}
        <div className="md:col-span-2 lg:col-span-3 h-full">
          {/* Ensure conversationId is passed as a string */}
          <ChatWindow conversationId={selectedConversationId} conversation={selectedConversation} />
        </div>
      </main>
    </div>
  );
}