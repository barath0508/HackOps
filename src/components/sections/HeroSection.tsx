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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              Where Innovation
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Meets Collaboration
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the ultimate platform for hackathons and tech competitions. Create, collaborate, 
              and compete with developers worldwide in a seamless, feature-rich environment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={onGetStarted}>
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Explore Events
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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