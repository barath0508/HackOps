import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Trophy, MapPin, Clock, Eye, FileText } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface AssignedEventsProps {
  user: any;
  events: any[];
  onEventUpdate: () => void;
}

const AssignedEvents: React.FC<AssignedEventsProps> = ({ user, events, onEventUpdate }) => {
  const [projects, setProjects] = useState([]);
  const [ratings, setRatings] = useState([]);
  const api = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, ratingsData] = await Promise.all([
        api.getProjects(),
        api.getRatings()
      ]);
      setProjects(projectsData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getEventStats = (eventId: string) => {
    const eventProjects = projects.filter((p: any) => p.eventId === eventId);
    const myRatings = ratings.filter((r: any) => r.eventId === eventId && r.judgeId === user._id);
    const totalRatings = ratings.filter((r: any) => r.eventId === eventId);
    
    return {
      totalProjects: eventProjects.length,
      myRatings: myRatings.length,
      totalRatings: totalRatings.length,
      completionRate: eventProjects.length > 0 ? Math.round((myRatings.length / eventProjects.length) * 100) : 0
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Assigned Events</h2>
        <p className="text-muted-foreground">Events where you are assigned as a judge</p>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => {
            const stats = getEventStats(event._id);
            
            return (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                        <Badge variant="outline">
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {stats.completionRate}% Complete
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Start</div>
                        <div className="text-muted-foreground">{formatDate(event.startDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">End</div>
                        <div className="text-muted-foreground">{formatDate(event.endDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Participants</div>
                        <div className="text-muted-foreground">{event.participants?.length || 0}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Submissions</div>
                        <div className="text-muted-foreground">{stats.totalProjects}</div>
                      </div>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground">{event.location}</div>
                        </div>
                      </div>
                    )}
                    {event.prizePool && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Prize Pool</div>
                          <div className="text-muted-foreground">${event.prizePool.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Judging Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Judging Progress</span>
                      <span>{stats.myRatings}/{stats.totalProjects}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tracks */}
                  {event.tracks && event.tracks.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Tracks</div>
                      <div className="flex flex-wrap gap-2">
                        {event.tracks.slice(0, 3).map((track: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {track}
                          </Badge>
                        ))}
                        {event.tracks.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{event.tracks.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Projects
                    </Button>
                    {event.status === 'active' && stats.myRatings < stats.totalProjects && (
                      <Button size="sm" variant="outline">
                        Continue Judging
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Events Assigned</h3>
            <p className="text-muted-foreground">
              You haven't been assigned to judge any events yet. Contact the event organizers if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignedEvents;