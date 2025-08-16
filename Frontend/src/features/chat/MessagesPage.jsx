import { useState } from "react";
import { Header } from "@/components/Header";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";

const mockConversations = [
  { id: 1, name: "Jessica", avatar: "https://i.pravatar.cc/150?img=1", lastMessage: "Yes, it is. Glad you like it!", time: "10:42 AM" },
  { id: 2, name: "Mike", avatar: "https://i.pravatar.cc/150?img=2", lastMessage: "Can I schedule a visit for this weekend?", time: "Yesterday" },
];

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-4rem)]">
        <div className="md:col-span-1 lg:col-span-1 h-full">
          <ConversationList conversations={mockConversations} onSelectConversation={setSelectedConversationId} />
        </div>
        <div className="md:col-span-2 lg:col-span-3 h-full">
          <ChatWindow conversation={selectedConversation} />
        </div>
      </main>
    </div>
  );
}