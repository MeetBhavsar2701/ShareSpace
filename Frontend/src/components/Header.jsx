import { Bell, Home, MessageSquare, Search, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg text-blue-600">Sharespace</span>
        </a>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by city, neighborhood, or address..." className="pl-10" />
        </div>

        <nav className="hidden items-center space-x-2 md:flex">
          <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/")}>
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/matches")}>
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/messages")}>
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="cursor-pointer" onClick={() => (window.location.href = "/profile")}>
            <AvatarImage src="https://i.pravatar.cc/150" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </nav>
      </div>
    </header>
  );
}