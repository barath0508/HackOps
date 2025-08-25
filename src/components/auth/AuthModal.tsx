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
      <DialogContent className="sm:max-w-md terminal-border bg-card/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold font-mono glitch">
            {'>'} ACCESS_TERMINAL <span className="text-primary">[HACK_OPS]</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full" onValueChange={() => setFormData({ name: '', email: '', password: '' })}>
          <TabsList className="grid w-full grid-cols-2 terminal-border bg-card/50">
            <TabsTrigger value="login" className="font-mono">[LOGIN]</TabsTrigger>
            <TabsTrigger value="signup" className="font-mono">[REGISTER]</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-primary">// EMAIL_ADDRESS</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@domain.com"
                    className="pl-10 terminal-border bg-card/30 font-mono"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-primary">// ACCESS_KEY</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 terminal-border bg-card/30 font-mono"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <Button className="w-full cyber-glow hover:bg-primary/90 transition-all duration-300 font-mono" onClick={() => handleSubmit('login')} disabled={isLoading}>
                {isLoading ? '[AUTHENTICATING...]' : '> EXECUTE_LOGIN'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-primary">// USER_IDENTITY</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="name"
                    placeholder="[CODENAME]"
                    className="pl-10 terminal-border bg-card/30 font-mono"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="font-mono text-primary">// CONTACT_PROTOCOL</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="user@cyber.net"
                    className="pl-10 terminal-border bg-card/30 font-mono"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="font-mono text-primary">// SECURITY_CIPHER</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="[ENCRYPTED_KEY]"
                    className="pl-10 terminal-border bg-card/30 font-mono"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-mono text-primary">// ACCESS_LEVEL</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 terminal-border transition-all duration-200 ${
                        selectedRole === role.id 
                          ? 'cyber-glow bg-primary/20' 
                          : 'bg-card/30 hover:bg-primary/10'
                      }`}
                    >
                      <div className="p-2 bg-primary/20 border border-primary mx-auto mb-2 w-fit">
                        <role.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-medium font-mono">[{role.label.toUpperCase()}]</p>
                    </button>
                  ))}
                </div>
                {defaultRole && (
                  <p className="text-xs text-muted-foreground text-center">
                    Pre-selected role: {defaultRole}
                  </p>
                )}
              </div>

              <Button className="w-full cyber-glow hover:bg-primary/90 transition-all duration-300 font-mono" onClick={() => handleSubmit('signup')} disabled={isLoading}>
                {isLoading ? '[INITIALIZING_USER...]' : '> CREATE_ACCOUNT'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground font-mono">
          // By accessing this terminal, you agree to our protocols
        </div>
      </DialogContent>
    </Dialog>
  );
};