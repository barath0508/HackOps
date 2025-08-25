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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Where Innovation
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Meets Collaboration
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Join the ultimate platform for hackathons and tech competitions. Create, collaborate, 
              and compete with developers worldwide in a seamless, feature-rich environment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 gradient-primary hover:scale-105 transition-all duration-300" 
              onClick={onGetStarted}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 hover:scale-105 transition-all duration-300"
            >
              Explore Events
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-16 px-4">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="p-4 md:p-6 glass-effect hover:scale-105 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-primary to-accent rounded-full">
                    <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
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