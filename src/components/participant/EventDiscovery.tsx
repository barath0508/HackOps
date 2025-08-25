import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Trophy, MapPin, Search, Filter } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { getEventStatus, getStatusColor } from '@/lib/eventUtils';

interface EventDiscoveryProps {
  user: any;
  events: any[];
  onJoinEvent: () => void;
}

const EventDiscovery: React.FC<EventDiscoveryProps> = ({ user, events, onJoinEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const api = useApi();

  const filteredEvents = (events || []).filter(event => {
    const currentStatus = getEventStatus(event.startDate, event.endDate);
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
    const matchesTrack = trackFilter === 'all' || event.tracks?.includes(trackFilter);
    return matchesSearch && matchesStatus && matchesTrack;
  });

  const handleJoinEvent = async (eventId: string) => {
    try {
      await api.joinEvent(eventId, user._id);
      toast.success('Successfully joined event!');
      onJoinEvent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event');
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="Blockchain">Blockchain</SelectItem>
            <SelectItem value="IoT">IoT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const currentStatus = getEventStatus(event.startDate, event.endDate);
          return (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`}></div>
                    <Badge variant="outline" className="text-xs">
                      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {event.participants?.length || 0} participants
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
                {event.prizePool && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    ${event.prizePool.toLocaleString()} prize pool
                  </div>
                )}
              </div>

              {event.tracks && event.tracks.length > 0 && (
                <div className="flex flex-wrap gap-1">
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
              )}

              <div className="pt-2">
                {event.participants?.includes(user._id) ? (
                  <Button disabled className="w-full">
                    Already Joined
                  </Button>
                ) : currentStatus === 'completed' ? (
                  <Button disabled className="w-full">
                    Event Completed
                  </Button>
                ) : event.maxParticipants && event.participants?.length >= event.maxParticipants ? (
                  <Button disabled className="w-full">
                    Event Full
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleJoinEvent(event._id)}
                    className="w-full"
                    disabled={api.loading}
                  >
                    {api.loading ? 'Joining...' : 'Join Event'}
                  </Button>
                )}
              </div>
            </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new events.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;