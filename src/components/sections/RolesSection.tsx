import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Settings, 
  Star,
  CheckCircle,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Trophy,
  Shield
} from "lucide-react";

interface RolesSectionProps {
  onRoleSelect?: (role: 'participant' | 'organizer' | 'judge') => void;
}

export const RolesSection = ({ onRoleSelect }: RolesSectionProps) => {
  const roles = [
    {
      id: 'participant' as const,
      icon: Users,
      title: "Participant",
      description: "Join hackathons, form teams, and build amazing projects",
      features: [
        "Browse and join events",
        "Team formation tools",
        "Project submission",
        "Real-time updates",
        "Certificate generation"
      ],
      color: "from-blue-500 to-purple-600",
      badge: "Popular"
    },
    {
      id: 'organizer' as const,
      icon: Settings,
      title: "Event Organizer",
      description: "Create and manage hackathons with comprehensive tools",
      features: [
        "Event creation & management",
        "Participant analytics",
        "Sponsor management",
        "Real-time announcements",
        "Custom evaluation criteria"
      ],
      color: "from-green-500 to-teal-600",
      badge: "Professional"
    },
    {
      id: 'judge' as const,
      icon: Star,
      title: "Judge",
      description: "Evaluate projects and provide valuable feedback",
      features: [
        "Project evaluation dashboard",
        "Scoring & feedback tools",
        "Multiple evaluation rounds",
        "Bias-free judging",
        "Analytics & insights"
      ],
      color: "from-orange-500 to-red-600",
      badge: "Expert"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose Your
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Perfect Role
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking to participate, organize, or judge events, 
            we have tailored experiences for every type of user.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <Card key={role.id} className="relative group hover:shadow-2xl transition-all duration-500 border-border/50 overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${role.color}`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="outline" className="group-hover:border-primary transition-colors">
                    {role.badge}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  onClick={() => onRoleSelect?.(role.id)}
                >
                  Get Started as {role.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};