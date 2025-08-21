import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/authentication/AuthContext";
import { cn } from "@/lib/utils"; // A utility for conditional classnames

export function ConversationList({ conversations, onSelectConversation, selectedConversationId }) {
  const { user } = useAuth();

  const getOtherUser = (convo) => {
    if (!user) return null;
    return convo.user_a.id === user.id ? convo.user_b : convo.user_a;
  };

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="border-r h-full overflow-y-auto bg-gray-50/50">
       <div className="p-4 border-b">
         <h2 className="text-xl font-bold">Chats</h2>
       </div>
      {conversations.map((convo) => {
        const otherUser = getOtherUser(convo);
        if (!otherUser) return null;
        
        const isSelected = convo.id == selectedConversationId;

        return (
          <div
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            className={cn(
              "flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200 border-b",
              isSelected 
                ? "bg-emerald-50 border-r-4 border-emerald-500" 
                : "hover:bg-gray-100"
            )}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherUser.avatar_url} alt={otherUser.username} />
              <AvatarFallback className="text-lg">
                {otherUser.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{otherUser.username}</p>
              </div>
              {/* You can add last message preview here later */}
              {/* <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}