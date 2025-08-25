import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Calendar, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Settings,
  BarChart3,
  Eye,
  Edit
} from "lucide-react";
import { ProjectList } from "@/components/database/ProjectList";
import { EventForm } from "@/components/database/EventForm";
import EventConfiguration from "@/components/organizer/EventConfiguration";
import ParticipantManagement from "@/components/organizer/ParticipantManagement";
import AnnouncementCenter from "@/components/organizer/AnnouncementCenter";
import SubmissionTracking from "@/components/organizer/SubmissionTracking";
import { useGetProjects, useGetEvents, useGetUsers } from "@/hooks/useDatabase";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrganizerDashboardProps {
  userEmail?: string;
}

export const OrganizerDashboard = ({ userEmail = 'organizer@example.com' }: OrganizerDashboardProps) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const { data: projects } = useGetProjects();
  const { data: events = [] } = useGetEvents();
  const { data: users = [] } = useGetUsers();
  
  // Memoize expensive calculations
  const { projectList, myEvents, totalParticipants, totalJudges, eventProjectsMap } = useMemo(() => {
    const projectList = Array.isArray(projects) ? projects : [];
    const myEvents = events.filter(e => e.organizerId === userEmail);
    const totalParticipants = users.filter(u => u.role === 'participant').length;
    const totalJudges = users.filter(u => u.role === 'judge').length;
    
    // Create a map for efficient project lookup
    const eventProjectsMap = new Map();
    projectList.forEach(project => {
      const eventId = project.eventId;
      if (!eventProjectsMap.has(eventId)) {
        eventProjectsMap.set(eventId, []);
      }
      eventProjectsMap.get(eventId).push(project);
    });
    
    return { projectList, myEvents, totalParticipants, totalJudges, eventProjectsMap };
  }, [projects, events, users, userEmail]);


  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-lg text-muted-foreground font-medium">Create. Manage. Engage.</p>
        </div>
        <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm organizerId={userEmail} onSuccess={() => setShowEventForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myEvents.length}</p>
                <p className="text-sm text-muted-foreground">My Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projectList.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalJudges}</p>
                <p className="text-sm text-muted-foreground">Total Judges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">Event Config</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <EventConfiguration user={{ _id: userEmail, email: userEmail }} events={myEvents} onEventUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <ParticipantManagement user={{ _id: userEmail, email: userEmail }} events={myEvents} />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementCenter user={{ _id: userEmail, email: userEmail }} events={myEvents} onAnnouncementSent={() => {}} />
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <SubmissionTracking user={{ _id: userEmail, email: userEmail }} events={myEvents} projects={projectList} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">

          <div className="space-y-6">
            {/* My Events */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">My Events</h2>
              <div className="space-y-4">
                {myEvents.map((event) => {
                  const eventProjects = eventProjectsMap.get(event._id!) || [];
                  const participantCount = event.participants?.length || 0;
                  const conversionRate = participantCount > 0 ? Math.round((eventProjects.length / participantCount) * 100) : 0;
                  
                  return (
                    <Card key={event._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              event.status === 'active' ? 'default' : 
                              event.status === 'upcoming' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{participantCount}</p>
                            <p className="text-sm text-muted-foreground">Participants</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-accent">{eventProjects.length}</p>
                            <p className="text-sm text-muted-foreground">Submissions</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-success">{conversionRate}%</p>
                            <p className="text-sm text-muted-foreground">Conversion</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-500">{event.prizePool}</p>
                            <p className="text-sm text-muted-foreground">Prize Pool</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Event
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                          {event.status === 'active' && (
                            <Button variant="hero" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Update
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* All Projects */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">All Projects</h2>
              <ProjectList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};