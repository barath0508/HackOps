import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Search, Filter, Eye, Download, ExternalLink, Github, Calendar, Users, Trophy } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface SubmissionTrackingProps {
  user: any;
  events: any[];
  projects: any[];
}

const SubmissionTracking: React.FC<SubmissionTrackingProps> = ({ user, events, projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [ratings, setRatings] = useState([]);
  const api = useApi();

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const ratingsData = await api.getRatings();
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  };

  const organizerProjects = projects.filter(project => 
    events.some(event => event._id === project.eventId)
  );

  const filteredProjects = organizerProjects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === 'all' || project.eventId === selectedEvent;
    const matchesTrack = selectedTrack === 'all' || project.track === selectedTrack;
    
    return matchesSearch && matchesEvent && matchesTrack;
  });

  const getProjectRatings = (projectId: string) => {
    return ratings.filter((rating: any) => rating.projectId === projectId);
  };

  const getAverageRating = (projectId: string) => {
    const projectRatings = getProjectRatings(projectId);
    if (projectRatings.length === 0) return 0;
    const sum = projectRatings.reduce((acc: number, rating: any) => acc + rating.overallScore, 0);
    return (sum / projectRatings.length).toFixed(1);
  };

  const getEventTitle = (eventId: string) => {
    const event = events.find(e => e._id === eventId);
    return event?.title || 'Unknown Event';
  };

  const exportSubmissions = () => {
    const csvContent = [
      ['Title', 'Event', 'Track', 'Submitted By', 'Team Members', 'Technologies', 'Average Rating', 'Submission Date'].join(','),
      ...filteredProjects.map(project => [
        project.title || '',
        getEventTitle(project.eventId),
        project.track || '',
        project.submittedBy || '',
        project.teamMembers?.join('; ') || '',
        project.technologies?.join('; ') || '',
        getAverageRating(project._id),
        new Date(project.submissionDate || project.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Submissions exported successfully!');
  };

  const viewProjectDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const getSubmissionStats = () => {
    const totalSubmissions = organizerProjects.length;
    const submissionsWithRatings = organizerProjects.filter(p => getProjectRatings(p._id).length > 0).length;
    const avgRating = organizerProjects.length > 0 ? 
      (organizerProjects.reduce((acc, p) => acc + parseFloat(getAverageRating(p._id)), 0) / organizerProjects.length).toFixed(1) : '0.0';
    const totalRatings = ratings.length;

    return { totalSubmissions, submissionsWithRatings, avgRating, totalRatings };
  };

  const stats = getSubmissionStats();
  const allTracks = [...new Set(organizerProjects.map(p => p.track).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submission Tracking</h2>
          <p className="text-muted-foreground">Monitor and manage project submissions</p>
        </div>
        <Button onClick={exportSubmissions}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalSubmissions}</p>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.submissionsWithRatings}</p>
                <p className="text-xs text-muted-foreground">Rated Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalRatings}</p>
                <p className="text-xs text-muted-foreground">Total Ratings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                {allTracks.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredProjects.length})</CardTitle>
          <CardDescription>
            All project submissions for your events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const projectRatings = getProjectRatings(project._id);
                  const avgRating = getAverageRating(project._id);
                  
                  return (
                    <TableRow key={project._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getEventTitle(project.eventId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.track && (
                          <Badge variant="secondary">{project.track}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.submittedBy}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.teamMembers?.length || 1} member(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{avgRating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({projectRatings.length} rating{projectRatings.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(project.submissionDate || project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewProjectDetails(project)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No submissions found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Details Modal */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Project details and ratings
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Event</h4>
                  <Badge variant="outline">{getEventTitle(selectedProject.eventId)}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Track</h4>
                  {selectedProject.track && <Badge variant="secondary">{selectedProject.track}</Badge>}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
              </div>

              {/* Team */}
              <div>
                <h4 className="font-medium mb-2">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.teamMembers?.map((member: string, index: number) => (
                    <Badge key={index} variant="outline">{member}</Badge>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="grid gap-4 md:grid-cols-3">
                {selectedProject.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {selectedProject.demoUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {selectedProject.videoUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.videoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo Video
                    </a>
                  </Button>
                )}
              </div>

              {/* Ratings */}
              <div>
                <h4 className="font-medium mb-4">Ratings & Feedback</h4>
                <div className="space-y-4">
                  {getProjectRatings(selectedProject._id).map((rating: any) => (
                    <Card key={rating._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Judge: {rating.judgeId}</span>
                          <Badge variant="default">{rating.overallScore}/10</Badge>
                        </div>
                        {rating.feedback && (
                          <p className="text-sm text-muted-foreground">{rating.feedback}</p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          Rated on {new Date(rating.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getProjectRatings(selectedProject._id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No ratings yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionTracking;