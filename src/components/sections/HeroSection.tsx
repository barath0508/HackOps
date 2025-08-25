import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Trophy, Code2, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const stats = [
    { icon: Users, label: "Active Participants", value: "50K+" },
    { icon: Trophy, label: "Events Hosted", value: "1.2K+" },
    { icon: Code2, label: "Projects Submitted", value: "25K+" },
    { icon: Zap, label: "Innovation Rate", value: "98%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden matrix-bg">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="terminal-border p-8 bg-card/50 backdrop-blur-sm">
              <h1 className="text-2xl md:text-5xl font-bold leading-tight typing">
                {'>'} HACK_THE_FUTURE.exe
              </h1>
              <div className="mt-4 text-primary font-mono">
                <span className="glitch">[SYSTEM_ONLINE]</span>
              </div>
            </div>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 font-mono">
              // Elite developers. Cutting-edge challenges. Revolutionary solutions.
              <br />// Enter the matrix of competitive programming.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 cyber-glow hover:bg-primary/90 transition-all duration-300 font-mono" 
              onClick={onGetStarted}
            >
              {'>'} INITIALIZE_SESSION
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 terminal-border hover:bg-primary/10 transition-all duration-300 font-mono"
              onClick={() => {
                const eventsSection = document.querySelector('[data-component-name="EventsSection"]') || document.querySelector('section');
                eventsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {'>'} BROWSE_CHALLENGES
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-16 px-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="terminal-border p-4 md:p-6 bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 md:p-3 bg-primary/20 border border-primary rounded">
                    <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="text-center font-mono">
                    <p className="text-lg md:text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground uppercase">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />
    </section>
  );
};