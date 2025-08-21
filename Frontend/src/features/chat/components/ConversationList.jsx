import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";

export function ConversationList({ conversations, onSelectConversation }) {
  const { user } = useAuth();
  
  const getOtherUser = (convo) => {
    if (!user) return null;
    return convo.user_a.id === user.id ? convo.user_b : convo.user_a;
  };

  return (
    <div className="border-r h-full overflow-y-auto">
      {conversations.map((convo) => {
        const otherUser = getOtherUser(convo);
        if (!otherUser) return null;

        return (
          <div
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 border-b"
          >
            <Avatar>
              <AvatarImage src={otherUser.avatar_url} />
              <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{otherUser.username}</p>
              </div>
              {/* <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}