import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateEvent } from '@/hooks/useDatabase';
import { toast } from 'sonner';

interface EventFormProps {
  organizerId: string;
  onSuccess?: () => void;
}

export const EventForm = ({ organizerId, onSuccess }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    prizePool: ''
  });
  
  const createEvent = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEvent.mutateAsync({
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        maxParticipants: parseInt(formData.maxParticipants),
        prizePool: formData.prizePool,
        status: 'upcoming',
        organizerId,
        judges: [],
        participants: []
      });
      
      toast.success('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
        prizePool: ''
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="prizePool">Prize Pool</Label>
          <Input
            id="prizePool"
            value={formData.prizePool}
            onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
            placeholder="e.g., $10,000"
            required
          />
        </div>
      </div>
      
      <Button type="submit" disabled={createEvent.isPending} className="w-full">
        {createEvent.isPending ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  );
};