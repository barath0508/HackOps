import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Users, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/mongodb';

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

interface LeaderboardProps {
  eventId: string;
}

export const Leaderboard = ({ eventId }: LeaderboardProps) => {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', eventId],
    queryFn: () => api.get(`/events/${eventId}/leaderboard`),
    enabled: !!eventId
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No submissions yet</p>
        <p className="text-sm">Be the first to submit your project!</p>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Leaderboard
      </h3>
      
      <div className="space-y-3">
        {leaderboard.map((project: any, index: number) => (
          <Card key={project._id} className={`${index < 3 ? 'border-primary/20 bg-primary/5' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold">{project.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {project.teamMembers?.join(', ') || 'N/A'}
                    </div>
                    <div className="flex gap-1">
                      {project.technologies?.map((tech: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-bold">
                      {project.averageScore > 0 ? project.averageScore.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {project.ratingCount} rating{project.ratingCount !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="flex gap-1">
                    {project.githubUrl && isValidUrl(project.githubUrl) && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && isValidUrl(project.demoUrl) && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};