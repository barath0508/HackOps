import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Trophy, 
  FileText, 
  Clock,
  MapPin,
  ExternalLink,
  Plus
} from "lucide-react";
import { ProjectForm } from "@/components/database/ProjectForm";
import { ProjectList } from "@/components/database/ProjectList";
import { SubmissionForm } from "@/components/database/SubmissionForm";
import EventDiscovery from "@/components/participant/EventDiscovery";
import TeamManagement from "@/components/participant/TeamManagement";
import ProjectSubmission from "@/components/participant/ProjectSubmission";
import LiveUpdates from "@/components/participant/LiveUpdates";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEvents, useJoinEvent, useGetUsers, useGetProjects } from "@/hooks/useDatabase";
import { toast } from "sonner";

interface ParticipantDashboardProps {
  userEmail?: string;
}

export const ParticipantDashboard = ({ userEmail = 'user@example.com' }: ParticipantDashboardProps) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const { data: events = [] } = useGetEvents();
  const { data: users = [] } = useGetUsers();
  const { data: projects = [] } = useGetProjects();
  const joinEvent = useJoinEvent();
  
  const { activeEvents, upcomingEvents, userProjects, totalParticipants } = useMemo(() => {
    const activeEvents = events.filter(e => e.status === 'active');
    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const userProjects = projects.filter(p => p.submittedBy === userEmail);
    const totalParticipants = users.filter(u => u.role === 'participant').length;
    
    return { activeEvents, upcomingEvents, userProjects, totalParticipants };
  }, [events, projects, users, userEmail]);
  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent.mutateAsync({ eventId, userId: userEmail });
      toast.success('Successfully joined event!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to join event';
      toast.error(message);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Participant Dashboard</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">Build. Submit. Win.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm userEmail={userEmail} onSuccess={() => setShowProjectForm(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Project to Event</DialogTitle>
              </DialogHeader>
              <SubmissionForm userEmail={userEmail} onSuccess={() => setShowSubmissionForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="animate-slide-up">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 gradient-primary rounded-xl">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{activeEvents.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Active Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-gradient-to-r from-accent to-primary rounded-xl">
                <Trophy className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{userProjects.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">My Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{totalParticipants}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{upcomingEvents.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="events" className="text-xs md:text-sm">Events</TabsTrigger>
          <TabsTrigger value="teams" className="text-xs md:text-sm">Teams</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs md:text-sm hidden md:flex">Submissions</TabsTrigger>
          <TabsTrigger value="updates" className="text-xs md:text-sm hidden md:flex">Updates</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs md:text-sm">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <EventDiscovery user={{ _id: userEmail, email: userEmail }} events={events} onJoinEvent={handleJoinEvent} />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamManagement user={{ _id: userEmail, email: userEmail }} teams={[]} onTeamUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <ProjectSubmission user={{ _id: userEmail, email: userEmail }} events={activeEvents} onProjectSubmit={() => {}} />
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <LiveUpdates user={{ _id: userEmail, email: userEmail }} announcements={[]} />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {userProjects.map((project) => {
                const event = events.find(e => e._id === project.eventId);
                return (
                  <Card key={project._id} className="hover:shadow-lg transition-all duration-300 animate-slide-up">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <CardTitle className="text-base md:text-lg">{project.title}</CardTitle>
                        <Badge variant="outline" className="w-fit">{event?.title || 'Unknown Event'}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                        {project.technologies?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{project.technologies.length - 3}</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Team: {project.teamMembers.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          Submitted: {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {userProjects.length === 0 && (
                <div className="col-span-full text-center p-6 md:p-8 text-muted-foreground">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No submissions yet</p>
                  <p className="text-xs md:text-sm">Submit your first project to an active event!</p>
                </div>
              )}
            </div>
            <ProjectList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};