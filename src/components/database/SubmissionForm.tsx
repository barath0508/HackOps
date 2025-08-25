import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProject, useGetEvents } from '@/hooks/useDatabase';
import { toast } from 'sonner';

interface SubmissionFormProps {
  userEmail: string;
  onSuccess?: () => void;
}

export const SubmissionForm = ({ userEmail, onSuccess }: SubmissionFormProps) => {
  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    teamMembers: '',
    technologies: ''
  });
  
  const createProject = useCreateProject();
  const { data: events = [] } = useGetEvents();
  
  const activeEvents = events.filter(e => 
    e.status === 'active' && e.participants?.includes(userEmail)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventId) {
      toast.error('Please select an event');
      return;
    }
    
    if (!formData.githubUrl && !formData.demoUrl) {
      toast.error('Please provide at least a GitHub repository or demo URL');
      return;
    }
    
    try {
      await createProject.mutateAsync({
        title: formData.title,
        description: formData.description,
        teamMembers: formData.teamMembers ? formData.teamMembers.split(',').map(m => m.trim()) : [userEmail],
        submittedBy: userEmail,
        eventId: formData.eventId,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : []
      });
      
      toast.success('Project submitted successfully!');
      setFormData({
        eventId: '',
        title: '',
        description: '',
        githubUrl: '',
        demoUrl: '',
        teamMembers: '',
        technologies: ''
      });
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to submit project';
      toast.error(message);
    }
  };

  if (activeEvents.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No active events available for submission.</p>
        <p className="text-sm text-muted-foreground mt-2">Join an event first to submit your project.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="event">Select Event</Label>
        <Select value={formData.eventId} onValueChange={(value) => setFormData({ ...formData, eventId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an active event" />
          </SelectTrigger>
          <SelectContent>
            {activeEvents.map((event) => (
              <SelectItem key={event._id} value={event._id!}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter your project title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your project..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="githubUrl">GitHub Repository URL *</Label>
        <Input
          id="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          placeholder="https://github.com/username/project"
        />
      </div>
      
      <div>
        <Label htmlFor="demoUrl">Live Demo URL *</Label>
        <Input
          id="demoUrl"
          type="url"
          value={formData.demoUrl}
          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
          placeholder="https://your-project-demo.com"
        />
      </div>
      
      <div>
        <Label htmlFor="teamMembers">Team Members (comma separated)</Label>
        <Input
          id="teamMembers"
          value={formData.teamMembers}
          onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
          placeholder="John Doe, Jane Smith (leave empty if solo)"
        />
      </div>
      
      <div>
        <Label htmlFor="technologies">Technologies Used (comma separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="React, Node.js, MongoDB"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        * At least one URL (GitHub or Demo) is required
      </p>
      
      <Button type="submit" disabled={createProject.isPending} className="w-full">
        {createProject.isPending ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  );
};