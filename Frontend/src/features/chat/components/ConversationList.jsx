import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ConversationList({ conversations, onSelectConversation }) {
  return (
    <div className="border-r h-full overflow-y-auto">
      {conversations.map((convo) => (
        <div
          key={convo.id}
          onClick={() => onSelectConversation(convo.id)}
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 border-b"
        >
          <Avatar>
            <AvatarImage src={convo.avatar} />
            <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{convo.name}</p>
              <p className="text-xs text-muted-foreground">{convo.time}</p>
            </div>
            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}