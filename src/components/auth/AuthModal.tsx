import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Star, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (data: any) => Promise<void>;
  defaultRole?: 'participant' | 'organizer' | 'judge' | null;
}

export const AuthModal = ({ isOpen, onClose, onAuth, defaultRole }: AuthModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'participant' | 'organizer' | 'judge'>(defaultRole || 'participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'participant' as const, icon: Users, label: 'Participant', color: 'from-blue-500 to-purple-600' },
    { id: 'organizer' as const, icon: Settings, label: 'Organizer', color: 'from-green-500 to-teal-600' },
    { id: 'judge' as const, icon: Star, label: 'Judge', color: 'from-orange-500 to-red-600' }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (type: 'login' | 'signup') => {
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'signup') {
        if (!formData.name.trim()) {
          toast.error('Please enter your name');
          setIsLoading(false);
          return;
        }
        
        await onAuth({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          isLogin: false
        });
      } else {
        await onAuth({
          email: formData.email,
          password: formData.password,
          isLogin: true
        });
      }
      
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">HackOps</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full" onValueChange={() => setFormData({ name: '', email: '', password: '' })}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <Button variant="hero" className="w-full" onClick={() => handleSubmit('login')} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedRole === role.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`p-2 rounded-md bg-gradient-to-r ${role.color} mx-auto mb-2 w-fit`}>
                        <role.icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-medium">{role.label}</p>
                    </button>
                  ))}
                </div>
                {defaultRole && (
                  <p className="text-xs text-muted-foreground text-center">
                    Pre-selected role: {defaultRole}
                  </p>
                )}
              </div>

              <Button variant="hero" className="w-full" onClick={() => handleSubmit('signup')} disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};