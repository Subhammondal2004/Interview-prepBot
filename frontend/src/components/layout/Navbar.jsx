import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, BookOpen, History, BarChart3, Brain, LogOut, Library, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/practice', label: 'Practice', icon: BookOpen },
  { path: '/question-bank', label: 'Questions', icon: Library },
  { path: '/history', label: 'History', icon: History },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const URL = import.meta.env.VITE_SERVER_URL;

  const handleLogout = () => {
    axios.get(`${URL}/users/logout`,
      {
        withCredentials: true
      }
    ).then((res)=>{
      toast({
        description: res.data.message,
        variant: "success",
        duration: 2000,
      })
      logout();
      navigate('/');
    }).catch((error)=>{
      toast({
        description: error.response.data.message,
        variant: "error",
        duration: 2000,
      })
    })
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

   return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">InterviewAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 transition-all duration-300 hover:rotate-12 active:scale-90"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            <Link 
              to="/profile"
              className="ml-2 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-all duration-200"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 active:scale-90"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <Link 
              to="/profile"
              className="flex items-center justify-center p-1 rounded-lg hover:bg-muted transition-all duration-200"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
