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
    <div className="space-y-4 md:space-y-6 animate-fade-in matrix-bg">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
          <Input
            placeholder="// Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 terminal-border bg-card/30 backdrop-blur-sm font-mono"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] terminal-border bg-card/30 backdrop-blur-sm font-mono">
            <SelectValue placeholder="[STATUS_FILTER]" />
          </SelectTrigger>
          <SelectContent className="terminal-border bg-card backdrop-blur-sm">
            <SelectItem value="all">[ALL_STATUS]</SelectItem>
            <SelectItem value="upcoming">[UPCOMING]</SelectItem>
            <SelectItem value="ongoing">[ONGOING]</SelectItem>
            <SelectItem value="completed">[COMPLETED]</SelectItem>
          </SelectContent>
        </Select>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-full sm:w-[180px] terminal-border bg-card/30 backdrop-blur-sm font-mono">
            <SelectValue placeholder="[TRACK_FILTER]" />
          </SelectTrigger>
          <SelectContent className="terminal-border bg-card backdrop-blur-sm">
            <SelectItem value="all">[ALL_TRACKS]</SelectItem>
            <SelectItem value="AI/ML">[AI/ML]</SelectItem>
            <SelectItem value="Web Development">[WEB_DEV]</SelectItem>
            <SelectItem value="Mobile">[MOBILE]</SelectItem>
            <SelectItem value="Blockchain">[BLOCKCHAIN]</SelectItem>
            <SelectItem value="IoT">[IOT]</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const currentStatus = getEventStatus(event.startDate, event.endDate);
          return (
            <div key={event._id} className="terminal-border bg-card/30 backdrop-blur-sm hover:cyber-glow transition-all duration-300 animate-slide-up p-6" style={{ animationDelay: `${filteredEvents.indexOf(event) * 0.1}s` }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 ${getStatusColor(currentStatus)} border border-primary`}></div>
                  <span className="text-xs font-mono text-primary border border-primary px-2 py-1">
                    [{currentStatus.toUpperCase()}]
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono">
                  {'>'} {event.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 font-mono text-sm">
                  // {event.description}
                </p>
              </div>
              <div className="space-y-4 mt-4">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  {event.participants?.length || 0} participants
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location}
                  </div>
                )}
                {event.prizePool && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4 text-primary" />
                    ${event.prizePool.toLocaleString()} prize pool
                  </div>
                )}
              </div>

              {event.tracks && event.tracks.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.tracks.slice(0, 3).map((track: string, index: number) => (
                    <span key={index} className="text-xs font-mono text-primary border border-primary px-2 py-1">
                      [{track}]
                    </span>
                  ))}
                  {event.tracks.length > 3 && (
                    <span className="text-xs font-mono text-primary border border-primary px-2 py-1">
                      [+{event.tracks.length - 3}]
                    </span>
                  )}
                </div>
              )}

              <div className="pt-2">
                {event.participants?.includes(user._id) ? (
                  <Button disabled className="w-full terminal-border bg-primary/20 font-mono">
                    [ALREADY_JOINED]
                  </Button>
                ) : currentStatus === 'completed' ? (
                  <Button disabled className="w-full terminal-border bg-red-500/20 font-mono">
                    [EVENT_COMPLETED]
                  </Button>
                ) : event.maxParticipants && event.participants?.length >= event.maxParticipants ? (
                  <Button disabled className="w-full terminal-border bg-yellow-500/20 font-mono">
                    [EVENT_FULL]
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleJoinEvent(event._id)}
                    className="w-full cyber-glow hover:bg-primary/90 transition-all duration-300 font-mono"
                    disabled={api.loading}
                  >
                    {api.loading ? '[JOINING...]' : '> JOIN_EVENT'}
                  </Button>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 md:py-12 animate-fade-in">
          <Search className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">No events found</h3>
          <p className="text-sm md:text-base text-muted-foreground px-4">
            Try adjusting your search criteria or check back later for new events.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;