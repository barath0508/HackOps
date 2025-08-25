import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Platform Features
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive hackathon management tools for organizers, participants, and judges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={getBadgeVariant(feature.badge) as any}>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};