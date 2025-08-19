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
import { Home, User, LogOut, LayoutGrid, Plus, Menu, X, Bell } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    isAuthenticated: false,
    username: null,
    avatar: null,
    role: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateUserState = () => {
    const token = sessionStorage.getItem('access_token');
    const username = sessionStorage.getItem('username');
    const avatar = sessionStorage.getItem('avatar_url');
    const role = sessionStorage.getItem('role');
    if (token && username) {
      setUser({ isAuthenticated: true, username, avatar, role });
    } else {
      setUser({ isAuthenticated: false, username: null, avatar: null, role: null });
    }
  };

  useEffect(() => {
    updateUserState();

    const handleUpdate = () => updateUserState();

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('profileUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('profileUpdated', handleUpdate);
    };
  }, []);


  const handleLogout = () => {
    sessionStorage.clear();
    updateUserState();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const LoggedInNav = ({ isMobile }) => {
    if (isMobile) {
      return (
        <>
          <Link to="/listings" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-start"><Home className="mr-2 h-4 w-4" />Listings</Button>
          </Link>
          <Link to="/dashboard" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-start"><LayoutGrid className="mr-2 h-4 w-4" />Dashboard</Button>
          </Link>
          <Link to="/profile" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-start"><User className="mr-2 h-4 w-4" />Profile</Button>
          </Link>
          {user.role === 'Lister' && (
            <Link to="/add-listing" onClick={closeMobileMenu}>
              <Button className="w-full justify-start bg-emerald-50 hover:bg-emerald-100 text-emerald-700">
                  <Plus className="mr-2 h-4 w-4" /> Post a Listing
              </Button>
            </Link>
          )}
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />Log out
          </Button>
        </>
      );
    }

    return (
      <>
        <Link to="/listings">
          <Button variant="ghost">Listings</Button>
        </Link>
        <Link to="/notifications">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        {user.role === 'Lister' && (
          <Link to="/add-listing">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" /> Post a Listing
            </Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <Avatar className={`${user.avatar ? "border-2 border-emerald-500" : ""} w-10 h-10`}>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-sm font-medium">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
      </>
    );
  };
  
  const LoggedOutNav = ({ isMobile }) => (
    <>
      <Link to="/listings" onClick={isMobile ? closeMobileMenu : undefined}>
        <Button variant="ghost" className="w-full justify-start"><Home className="mr-2 h-4 w-4" />Browse</Button>
      </Link>
      <Link to="/login" onClick={isMobile ? closeMobileMenu : undefined}>
        <Button variant="ghost" className="w-full justify-start">Log In</Button>
      </Link>
      <Link to="/signup" onClick={isMobile ? closeMobileMenu : undefined}>
        <Button className="w-full justify-start md:justify-center bg-emerald-500 hover:bg-emerald-600 text-white">Sign Up</Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
             <Home className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ShareSpace</span>
        </Link>
        
        <nav className="hidden md:flex md:items-center md:gap-2">
            {user.isAuthenticated ? <LoggedInNav isMobile={false} /> : <LoggedOutNav isMobile={false} />}
        </nav>
        
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
          <nav className="md:hidden px-4 pb-4 space-y-2 border-t absolute bg-white w-full shadow-lg">
              {user.isAuthenticated ? <LoggedInNav isMobile={true} /> : <LoggedOutNav isMobile={true} />}
          </nav>
      )}
    </header>
  );
}