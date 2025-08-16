import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ChatWindow({ conversation }) {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-lg">{conversation.name}</h2>
      </div>
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {/* Chat Bubbles */}
        <div className="flex items-end gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none max-w-xs">
            <p>Hey! Saw your listing. It looks great. Is it still available?</p>
          </div>
        </div>
        <div className="flex items-end gap-2 justify-end">
          <div className="bg-blue-600 text-white p-3 rounded-lg rounded-br-none max-w-xs">
            <p>Hi! Yes, it is. Glad you like it!</p>
          </div>
        </div>
      </div>
      <div className="border-t p-4">
        <div className="relative">
          <Input placeholder="Type your message..." className="pr-12" />
          <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}