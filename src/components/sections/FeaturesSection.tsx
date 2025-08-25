
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Zap,
  Trophy,
  Globe
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create and manage hackathons with complete customization options",
      badge: "Core",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Team Formation",
      description: "Smart team matching and collaboration tools for participants",
      badge: "Core",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Project Submission",
      description: "Seamless submission process with multimedia support",
      badge: "Core",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: MessageSquare,
      title: "Real-time Communication",
      description: "Instant announcements, Q&A, and team chat features",
      badge: "Core",
      color: "from-pink-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for organizers and participants",
      badge: "Pro",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "AI Plagiarism Detection",
      description: "Advanced AI-powered similarity detection for submissions",
      badge: "AI",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Automated Certificates",
      description: "Generate and distribute certificates automatically",
      badge: "Pro",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Trophy,
      title: "Live Leaderboards",
      description: "Real-time scoring and ranking with WebSocket updates",
      badge: "Pro",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Web3 Integration",
      description: "NFT badges and blockchain-based proof of participation",
      badge: "Web3",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Core": return "default";
      case "Pro": return "secondary";
      case "AI": return "destructive";
      case "Web3": return "outline";
      default: return "default";
    }
  };

  return (
    <section className="py-12 md:py-24 matrix-bg">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8 md:mb-16 animate-fade-in">
          <div className="terminal-border p-6 bg-card/30 backdrop-blur-sm inline-block">
            <h2 className="text-2xl md:text-4xl font-bold font-mono">
              {'>'} SYSTEM_MODULES.scan()
              <span className="block text-primary glitch">
                [FEATURES_DETECTED]
              </span>
            </h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
            // Advanced toolkit for digital warfare
            <br />// All systems operational
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 md:p-3 border border-primary bg-primary/20">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary border border-primary px-2 py-1">
                    [{feature.badge}]
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-mono">{feature.title}</h3>
              </div>
              <div className="mt-4">
                <p className="text-sm md:text-base text-muted-foreground font-mono">
                  // {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};