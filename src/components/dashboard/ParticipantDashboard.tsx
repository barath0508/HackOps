
import { Button } from "@/components/ui/button";

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
    <div className="p-4 md:p-6 space-y-4 md:space-y-8 animate-fade-in matrix-bg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold font-mono glitch">{'>'} PARTICIPANT_TERMINAL</h1>
          <p className="text-sm md:text-lg text-primary font-medium font-mono">// Build. Submit. Win.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto cyber-glow hover:bg-primary/90 transition-all duration-300 font-mono">
                <Plus className="h-4 w-4 mr-2" />
                {'>'} CREATE_PROJECT
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 terminal-border bg-background/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="font-mono text-primary">[CREATE_NEW_PROJECT]</DialogTitle>
              </DialogHeader>
              <ProjectForm userEmail={userEmail} onSuccess={() => setShowProjectForm(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto terminal-border hover:bg-primary/10 transition-all duration-300 font-mono">
                <FileText className="h-4 w-4 mr-2" />
                {'>'} SUBMIT_PROJECT
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-2xl terminal-border bg-background/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="font-mono text-primary">[SUBMIT_PROJECT_TO_EVENT]</DialogTitle>
              </DialogHeader>
              <SubmissionForm userEmail={userEmail} onSuccess={() => setShowSubmissionForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-3 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-primary/20 border border-primary">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold font-mono text-primary">{activeEvents.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground font-mono">[ACTIVE_EVENTS]</p>
            </div>
          </div>
        </div>
        
        <div className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-3 md:p-6" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-primary/20 border border-primary">
              <Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold font-mono text-primary">{userProjects.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground font-mono">[MY_PROJECTS]</p>
            </div>
          </div>
        </div>
        
        <div className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-3 md:p-6" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-primary/20 border border-primary">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold font-mono text-primary">{totalParticipants}</p>
              <p className="text-xs md:text-sm text-muted-foreground font-mono">[PARTICIPANTS]</p>
            </div>
          </div>
        </div>
        
        <div className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-3 md:p-6" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-primary/20 border border-primary">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold font-mono text-primary">{upcomingEvents.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground font-mono">[UPCOMING]</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto terminal-border bg-card/30 backdrop-blur-sm">
          <TabsTrigger value="events" className="text-xs md:text-sm font-mono">[EVENTS]</TabsTrigger>
          <TabsTrigger value="teams" className="text-xs md:text-sm font-mono">[TEAMS]</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs md:text-sm hidden md:flex font-mono">[SUBMISSIONS]</TabsTrigger>
          <TabsTrigger value="updates" className="text-xs md:text-sm hidden md:flex font-mono">[UPDATES]</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs md:text-sm font-mono">[PROJECTS]</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4 md:mt-6">
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
                  <div key={project._id} className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-4 md:p-6">
                    <div className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-base md:text-lg font-bold font-mono text-primary">[{project.title}]</h3>
                        <div className="terminal-border bg-primary/20 px-2 py-1 text-xs font-mono text-primary w-fit">{event?.title || 'Unknown Event'}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 font-mono">// {project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech, index) => (
                          <span key={index} className="terminal-border bg-primary/20 px-2 py-1 text-xs font-mono text-primary">{tech}</span>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span className="terminal-border bg-primary/20 px-2 py-1 text-xs font-mono text-primary">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                          <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="truncate">[TEAM]: {project.teamMembers.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                          <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                          [SUBMITTED]: {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="terminal-border bg-card/30 hover:bg-primary/10 transition-all duration-300 px-3 py-2 text-sm font-mono w-full sm:w-auto text-center inline-flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            {'>'} GITHUB
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="terminal-border bg-card/30 hover:bg-primary/10 transition-all duration-300 px-3 py-2 text-sm font-mono w-full sm:w-auto text-center inline-flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            {'>'} DEMO
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {userProjects.length === 0 && (
                <div className="col-span-full text-center p-6 md:p-8 text-muted-foreground terminal-border bg-card/30 backdrop-blur-sm">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50 text-primary" />
                  <p className="text-sm md:text-base font-mono">[NO_SUBMISSIONS_FOUND]</p>
                  <p className="text-xs md:text-sm font-mono">// Submit your first project to an active event!</p>
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