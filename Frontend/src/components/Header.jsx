import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, User, LogOut, LayoutGrid, Plus } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    isAuthenticated: false,
    username: null,
    avatar: null,
  });

  const updateUserState = () => {
    const token = sessionStorage.getItem('access_token');
    const username = sessionStorage.getItem('username');
    const avatar = sessionStorage.getItem('user_avatar');
    if (token && username) {
      setUser({ isAuthenticated: true, username, avatar });
    } else {
      setUser({ isAuthenticated: false, username: null, avatar: null });
    }
  };

  useEffect(() => {
    updateUserState();
    window.addEventListener('storage', updateUserState); // Listen for changes
    return () => {
      window.removeEventListener('storage', updateUserState); // Cleanup
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser({ isAuthenticated: false, username: null, avatar: null });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
             <Home className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ShareSpace</span>
        </Link>
        <nav>
          {user.isAuthenticated ? (
            <div className="flex items-center gap-4">
               <Link to="/listings">
                <Button variant="ghost">Listings</Button>
              </Link>
              <Link to="/add-listing">
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Post a Listing
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-lg w-48">
                  <DropdownMenuLabel>Hi, {user.username}!</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/listings">
                <Button variant="ghost">Browse</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}