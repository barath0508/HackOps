import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Settings, Users, Trophy, MapPin, Clock, X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface EventConfigurationProps {
  user: any;
  events: any[];
  onEventUpdate: () => void;
}

const EventConfiguration: React.FC<EventConfigurationProps> = ({ user, events, onEventUpdate }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    prizePool: '',
    tracks: [] as string[],
    judges: [] as string[],
    requirements: '',
    rules: ''
  });
  const [newTrack, setNewTrack] = useState('');
  const [newJudge, setNewJudge] = useState('');
  const api = useApi();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTrack = () => {
    if (newTrack.trim() && !formData.tracks.includes(newTrack.trim())) {
      setFormData(prev => ({
        ...prev,
        tracks: [...prev.tracks, newTrack.trim()]
      }));
      setNewTrack('');
    }
  };

  const removeTrack = (track: string) => {
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t !== track)
    }));
  };

  const addJudge = () => {
    if (newJudge.trim() && !formData.judges.includes(newJudge.trim())) {
      setFormData(prev => ({
        ...prev,
        judges: [...prev.judges, newJudge.trim()]
      }));
      setNewJudge('');
    }
  };

  const removeJudge = (judge: string) => {
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.filter(j => j !== judge)
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.createEvent({
        ...formData,
        organizerId: user._id,
        organizerName: user.name,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        prizePool: formData.prizePool ? parseFloat(formData.prizePool) : null
      });
      
      toast.success('Event created successfully!');
      setShowCreateEvent(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
        prizePool: '',
        tracks: [],
        judges: [],
        requirements: '',
        rules: ''
      });
      onEventUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Configuration</h2>
          <p className="text-muted-foreground">Create and manage your hackathon events</p>
        </div>
        <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Set up a new hackathon event with all the details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Online / City, Country"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your hackathon event"
                  rows={3}
                  required
                />
              </div>

              {/* Dates and Limits */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="prizePool">Prize Pool ($)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => handleInputChange('prizePool', e.target.value)}
                    placeholder="Total prize amount"
                  />
                </div>
              </div>

              {/* Tracks */}
              <div>
                <Label>Event Tracks</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value)}
                    placeholder="Add track (e.g., AI/ML, Web Dev)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrack())}
                  />
                  <Button type="button" onClick={addTrack} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tracks.map((track) => (
                    <Badge key={track} variant="secondary" className="flex items-center gap-1">
                      {track}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTrack(track)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Judges */}
              <div>
                <Label>Judges</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newJudge}
                    onChange={(e) => setNewJudge(e.target.value)}
                    placeholder="Add judge email"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addJudge())}
                  />
                  <Button type="button" onClick={addJudge} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.judges.map((judge) => (
                    <Badge key={judge} variant="secondary" className="flex items-center gap-1">
                      {judge}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeJudge(judge)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="What are the requirements for participation?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rules">Rules & Guidelines</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder="Event rules and guidelines"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={api.loading}>
                  {api.loading ? 'Creating...' : 'Create Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateEvent(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {events.length > 0 ? (
          events.map((event) => (
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
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                      <div className="text-muted-foreground">
                        {event.participants?.length || 0}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                  )}
                  {event.prizePool && (
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Prize Pool</div>
                        <div className="text-muted-foreground">${event.prizePool.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>

                {event.tracks && event.tracks.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Tracks</div>
                    <div className="flex flex-wrap gap-2">
                      {event.tracks.map((track: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {track}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.judges && event.judges.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Judges</div>
                    <div className="flex flex-wrap gap-2">
                      {event.judges.map((judge: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {judge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Edit Event
                  </Button>
                  <Button variant="outline" size="sm">
                    View Analytics
                  </Button>
                  {event.status === 'active' && (
                    <Button size="sm">
                      Manage Live
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Events Created</h3>
              <p className="text-muted-foreground mb-4">
                Create your first hackathon event to get started
              </p>
              <Button onClick={() => setShowCreateEvent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventConfiguration;