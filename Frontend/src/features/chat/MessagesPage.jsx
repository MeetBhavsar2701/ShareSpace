import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  // useSearchParams now includes the setter function to manipulate the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // This effect SYNCS the state with the URL. The URL is the source of truth.
  useEffect(() => {
    const urlConvoId = searchParams.get('conversationId');
    setSelectedConversationId(urlConvoId);
  }, [searchParams]);

  // This effect FETCHES conversations and sets a default on desktop ONLY
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/chat/my/");
        setConversations(response.data);

        const urlConvoId = searchParams.get('conversationId');
        // If there's no conversation selected in the URL, and we are on a desktop screen,
        // automatically select the first conversation for a better user experience.
        if (!urlConvoId && response.data.length > 0 && window.innerWidth >= 768) {
          setSearchParams({ conversationId: response.data[0].id }, { replace: true });
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
  }, [user, authLoading, setSearchParams]);

  // Handler to update URL when a conversation is selected
  const handleSelectConversation = (id) => {
    setSearchParams({ conversationId: id });
  };

  // Handler for the "back" button on mobile, which just clears the URL param
  const handleBack = () => {
    setSearchParams({});
  };

  const selectedConversation = conversations.find(c => c.id == selectedConversationId);

  return (
    <div className="flex flex-col h-screen">
      {/* The main container is now a simple flex container, not a grid */}
      <main className="flex flex-grow h-[calc(100vh-4rem)]">
        {/* --- RESPONSIVE CONVERSATION LIST --- */}
        {/* On mobile (default): 'flex'. If convo is selected: 'hidden'. */}
        {/* On desktop ('md:'): Always 'flex'. */}
        <div
          className={`h-full w-full flex-col border-r md:w-1/3 lg:w-1/4 ${
            selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {loading || authLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">Loading chats...</div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
          )}
        </div>

        {/* --- RESPONSIVE CHAT WINDOW --- */}
        {/* On mobile (default): 'hidden'. If convo is selected: 'flex'. */}
        {/* On desktop ('md:'): Always 'flex'. */}
        <div
          className={`h-full w-full flex-col md:w-2/3 lg:w-3/4 ${
            selectedConversationId ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ChatWindow
            // The key is crucial! It forces the component to remount when the ID changes.
            // This ensures the WebSocket connection and message fetching logic runs correctly for the new conversation.
            key={selectedConversationId}
            conversationId={selectedConversationId}
            conversation={selectedConversation}
            onBack={handleBack}
          />
        </div>
      </main>
    </div>
  );
}