import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Github, ExternalLink, FileText, X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface ProjectSubmissionProps {
  user: any;
  events: any[];
  onProjectSubmit: () => void;
}

const ProjectSubmission: React.FC<ProjectSubmissionProps> = ({ user, events, onProjectSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventId: '',
    track: '',
    githubUrl: '',
    demoUrl: '',
    videoUrl: '',
    technologies: [] as string[],
    teamMembers: [user.email],
    challenges: '',
    solution: '',
    impact: ''
  });
  const [newTech, setNewTech] = useState('');
  const [newMember, setNewMember] = useState('');
  const api = useApi();

  const userEvents = events.filter(event => 
    event.participants?.includes(user._id) && event.status === 'active'
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addTeamMember = () => {
    if (newMember.trim() && !formData.teamMembers.includes(newMember.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember.trim()]
      }));
      setNewMember('');
    }
  };

  const removeTeamMember = (member: string) => {
    if (member !== user.email) { // Can't remove self
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m !== member)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.eventId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.createProject({
        ...formData,
        submittedBy: user._id,
        submissionDate: new Date().toISOString()
      });
      
      toast.success('Project submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventId: '',
        track: '',
        githubUrl: '',
        demoUrl: '',
        videoUrl: '',
        technologies: [],
        teamMembers: [user.email],
        challenges: '',
        solution: '',
        impact: ''
      });
      
      onProjectSubmit();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit project');
    }
  };

  const selectedEvent = events.find(e => e._id === formData.eventId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Submission</h2>
        <p className="text-muted-foreground">Submit your project to an active event</p>
      </div>

      {userEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Events</h3>
            <p className="text-muted-foreground">
              You need to join an active event before you can submit a project.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Project</CardTitle>
            <CardDescription>
              Fill out the form below to submit your project to an event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventId">Event *</Label>
                  <Select value={formData.eventId} onValueChange={(value) => handleInputChange('eventId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {userEvents.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project, what it does, and how it works"
                  rows={4}
                  required
                />
              </div>

              {/* Track Selection */}
              {selectedEvent?.tracks && (
                <div>
                  <Label htmlFor="track">Track</Label>
                  <Select value={formData.track} onValueChange={(value) => handleInputChange('track', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedEvent.tracks.map((track: string) => (
                        <SelectItem key={track} value={track}>
                          {track}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* URLs */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="githubUrl">GitHub Repository</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="demoUrl">Live Demo URL</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl}
                      onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                      placeholder="https://your-demo.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="videoUrl">Demo Video URL</Label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <Label>Technologies Used</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTechnology(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div>
                <Label>Team Members</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Add team member email"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                  />
                  <Button type="button" onClick={addTeamMember} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.teamMembers.map((member) => (
                    <Badge key={member} variant="secondary" className="flex items-center gap-1">
                      {member}
                      {member === user.email && <span className="text-xs">(You)</span>}
                      {member !== user.email && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTeamMember(member)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenges">Challenges Faced</Label>
                  <Textarea
                    id="challenges"
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    placeholder="What challenges did you encounter while building this project?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="solution">Solution Approach</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="How did you approach solving the problem?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="impact">Impact & Future Plans</Label>
                  <Textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    placeholder="What impact does your project have? What are your future plans?"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={api.loading}>
                  {api.loading ? 'Submitting...' : 'Submit Project'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    eventId: '',
                    track: '',
                    githubUrl: '',
                    demoUrl: '',
                    videoUrl: '',
                    technologies: [],
                    teamMembers: [user.email],
                    challenges: '',
                    solution: '',
                    impact: ''
                  });
                }}>
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectSubmission;