import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProject, useGetEvents } from '@/hooks/useDatabase';
import { toast } from 'sonner';

interface ProjectFormProps {
  userEmail: string;
  onSuccess?: () => void;
}

export const ProjectForm = ({ userEmail, onSuccess }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: '',
    eventId: '',
    githubUrl: '',
    demoUrl: '',
    technologies: ''
  });
  
  const createProject = useCreateProject();
  const { data: events = [] } = useGetEvents();
  
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'upcoming');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventId) {
      toast.error('Please select an event');
      return;
    }
    
    try {
      await createProject.mutateAsync({
        title: formData.title,
        description: formData.description,
        teamMembers: formData.teamMembers.split(',').map(m => m.trim()),
        submittedBy: userEmail,
        eventId: formData.eventId,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        technologies: formData.technologies.split(',').map(t => t.trim())
      });
      
      toast.success('Project created successfully!');
      setFormData({
        title: '',
        description: '',
        teamMembers: '',
        eventId: '',
        githubUrl: '',
        demoUrl: '',
        technologies: ''
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="event">Select Event</Label>
        <Select value={formData.eventId} onValueChange={(value) => setFormData({ ...formData, eventId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an event" />
          </SelectTrigger>
          <SelectContent>
            {activeEvents.map((event) => (
              <SelectItem key={event._id} value={event._id!}>
                {event.title} ({event.status})
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
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="teamMembers">Team Members (comma separated)</Label>
        <Input
          id="teamMembers"
          value={formData.teamMembers}
          onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
          placeholder="John Doe, Jane Smith"
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
      
      <div>
        <Label htmlFor="githubUrl">GitHub Repository (optional)</Label>
        <Input
          id="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          placeholder="https://github.com/username/repo"
        />
      </div>
      
      <div>
        <Label htmlFor="demoUrl">Live Demo URL (optional)</Label>
        <Input
          id="demoUrl"
          type="url"
          value={formData.demoUrl}
          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
          placeholder="https://your-demo.com"
        />
      </div>
      
      <Button type="submit" disabled={createProject.isPending} className="w-full">
        {createProject.isPending ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
};