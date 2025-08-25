import { Button } from "@/components/ui/button";
import { Code2, Bell, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  user?: {
    name: string;
    role: 'participant' | 'organizer' | 'judge';
    avatar?: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <header className="border-b border-primary/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <div className="p-2 terminal-border bg-card">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary font-mono glitch">
            [HACK_OPS]
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <button 
              onClick={handleDashboardClick}
              className={`transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div className="h-8 w-8 rounded border border-primary bg-primary/20 flex items-center justify-center text-primary text-sm font-medium font-mono">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onLogin}>
                Login
              </Button>
              <Button onClick={onLogin}>
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-10 w-10 rounded border border-primary bg-primary/20 flex items-center justify-center text-primary font-medium font-mono">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => {
                    onLogin?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    onLogin?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};