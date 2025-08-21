import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { Home, User, LogOut, LayoutGrid, Plus, Menu, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import shareSpaceLogo from '@/assets/logo0.png';

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState({
    isAuthenticated: false,
    username: null,
    avatar: null,
    role: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ... (user state logic remains the same)
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
    setIsMobileMenuOpeFn(false);
    navigate('/login');
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/listings", label: "Listings", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const LoggedInNav = ({ isMobile }) => {
    const activeLinkClasses = "bg-emerald-50 text-emerald-600 font-semibold";
    const inactiveLinkClasses = "hover:bg-gray-100";

    if (isMobile) {
      return (
        <div className="flex flex-col space-y-1 p-2">
          {user.role === 'Lister' && (
            <Link to="/add-listing">
              <Button className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white mb-2">
                <Plus className="mr-2 h-4 w-4" /> Post a Listing
              </Button>
            </Link>
          )}
          {navLinks.map((link) => (
            <Link to={link.href} key={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname.startsWith(link.href) ? activeLinkClasses : inactiveLinkClasses
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="border-t mx-2 pt-2 mt-2"></div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />Log out
          </Button>
        </div>
      );
    }

    // --- Desktop Logged In Nav ---
    return (
      <>
        <Link to="/listings">
          {/* FINAL CHANGE: Active link is now bold green text, not a background color */}
          <Button
            variant="ghost"
            className={cn(
              "font-bold text-base",
              pathname.startsWith('/listings') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
            )}
          >
            Listings
          </Button>
        </Link>
        {user.role === 'Lister' && (
          <Link to="/add-listing">
            <Button className="font-semibold">
              <Plus className="mr-2 h-4 w-4" /> Post
            </Button>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => navigate('/messages')}>
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <Avatar className="w-10 h-10 border-2 border-transparent hover:border-emerald-400">
                <AvatarImage src={user.avatar || ''} alt={user.username} />
                <AvatarFallback className="text-sm font-medium bg-gray-100">
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/dashboard')} className={cn("cursor-pointer", pathname.startsWith('/dashboard') && activeLinkClasses)}>
              <LayoutGrid className="mr-2 h-4 w-4" /><span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/profile')} className={cn("cursor-pointer", pathname.startsWith('/profile') && activeLinkClasses)}>
              <User className="mr-2 h-4 w-4" /><span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  const LoggedOutNav = ({ isMobile }) => (
    <>
      <Link to="/listings">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start md:w-auto font-bold text-base',
            isMobile && 'py-6 text-lg',
            // FINAL CHANGE: Active link is now bold green text for desktop view
            pathname.startsWith('/listings')
              ? (isMobile ? 'bg-emerald-50 text-emerald-600' : 'text-emerald-600')
              : (isMobile ? '' : 'text-gray-600 hover:text-emerald-600')
          )}
        >
          Browse
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="ghost" className={`w-full justify-start md:w-auto text-base ${isMobile && 'py-6 text-lg'}`}>
          Log In
        </Button>
      </Link>
      <Link to="/signup">
        <Button className={`w-full md:w-auto text-white bg-emerald-500 hover:bg-emerald-600 ${isMobile && 'py-6 text-lg'}`}>
          Sign Up
        </Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          {/* <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-emerald-600" />
          </div> */}
           <img src={shareSpaceLogo} alt="ShareSpace Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight text-gray-800">ShareSpace</span>
        </Link>
        
        <nav className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
          {user.isAuthenticated ? <LoggedInNav isMobile={false} /> : <LoggedOutNav isMobile={false} />}
        </nav>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t absolute bg-white w-full shadow-lg animate-in fade-in-0 slide-in-from-top-2">
          {user.isAuthenticated ? <LoggedInNav isMobile={true} /> : <LoggedOutNav isMobile={true} />}
        </nav>
      )}
    </header>
  );
}