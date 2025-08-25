import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { RolesSection } from "@/components/sections/RolesSection";
import { AuthModal } from "@/components/auth/AuthModal";

interface IndexProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<any>;
  onRegister: (userData: any) => Promise<any>;
}

const Index = ({ onLogin, onRegister }: IndexProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'participant' | 'organizer' | 'judge' | null>(null);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleRoleSelect = (role: 'participant' | 'organizer' | 'judge') => {
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  const handleAuthComplete = async (userData: any) => {
    try {
      if (userData.isLogin) {
        await onLogin({ email: userData.email, password: userData.password });
      } else {
        await onRegister({
          ...userData,
          role: selectedRole || userData.role
        });
      }
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={null} 
        onLogin={() => setShowAuthModal(true)} 
        onLogout={() => {}}
      />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <EventsSection 
          onEventSelect={(eventId) => console.log('Selected event:', eventId)}
          onRegister={handleGetStarted}
        />
        <FeaturesSection />
        <RolesSection onRoleSelect={handleRoleSelect} />
      </main>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedRole(null);
        }}
        onAuth={handleAuthComplete}
        defaultRole={selectedRole}
      />
    </div>
  );
};

export default Index;
