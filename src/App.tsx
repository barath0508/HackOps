import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Header } from "@/components/layout/Header";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const storedUser = localStorage.getItem('hackops_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        try {
          const currentUser = await api.getUser(userData.email);
          setUser(currentUser);
        } catch (error) {
          localStorage.removeItem('hackops_user');
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      localStorage.removeItem('hackops_user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const userData = await api.loginUser(credentials);
      setUser(userData);
      localStorage.setItem('hackops_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      await api.createUser(userData);
      const loginData = await api.loginUser({
        email: userData.email,
        password: userData.password
      });
      setUser(loginData);
      localStorage.setItem('hackops_user', JSON.stringify(loginData));
      toast.success(`Welcome to HackOps, ${loginData.name}!`);
      return loginData;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hackops_user');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Loading HackOps...</h2>
          <p className="text-muted-foreground mt-2">Preparing your hackathon experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mobile-safe">
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Index onLogin={handleLogin} onRegister={handleRegister} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <div className="flex flex-col min-h-screen">
                <Header user={user} onLogout={handleLogout} />
                <main className="flex-1">
                  <Dashboard user={user} />
                </main>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          position="top-right" 
          richColors 
          expand={true}
          duration={4000}
        />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
