import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Users, 
  Trophy, 
  MapPin,
  Clock,
  Target
} from "lucide-react";
import { useApi } from '@/hooks/useApi';
import { getEventStatus, getStatusColor } from '@/lib/eventUtils';

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  participants?: string[];
  maxParticipants?: number;
  location?: string;
  prizePool?: number;
  tracks?: string[];
  organizer: string;
}

interface EventsSectionProps {
  onEventSelect?: (eventId: string) => void;
  onRegister?: () => void;
}

export const EventsSection = ({ onEventSelect, onRegister }: EventsSectionProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.getEvents();
        setEvents(response.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    onEventSelect?.(event._id);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold animate-fade-in">
              Live Events
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Loading...
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-16 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-bold">
              Live Events
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Join the Innovation
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              No events available at the moment. Check back soon for exciting hackathons!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-16 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-bold">
              Live Events
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Join the Innovation
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exciting hackathons and competitions happening right now.
              Click on any event to learn more and register.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {events.map((event, index) => {
              const currentStatus = getEventStatus(event.startDate, event.endDate);
              return (
                <Card 
                  key={event._id} 
                  className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-border/50 cursor-pointer animate-scale-in glass-effect"
                  onClick={() => handleEventClick(event)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`}></div>
                    <Badge variant="outline" className="text-xs">
                      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  
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
                    {event.prizePool && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        ${event.prizePool.toLocaleString()} prize pool
                      </div>
                    )}
                  </div>

                  {event.tracks && event.tracks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.tracks.slice(0, 2).map((track, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {track}
                        </Badge>
                      ))}
                      {event.tracks.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tracks.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(getEventStatus(selectedEvent.startDate, selectedEvent.endDate))}`}></div>
                <Badge variant="outline">
                  {getEventStatus(selectedEvent.startDate, selectedEvent.endDate).charAt(0).toUpperCase() + getEventStatus(selectedEvent.startDate, selectedEvent.endDate).slice(1)}
                </Badge>
              </div>

              <p className="text-muted-foreground">{selectedEvent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.participants?.length || 0}
                        {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`} registered
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedEvent.prizePool && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Prize Pool</p>
                        <p className="text-sm text-muted-foreground">
                          ${selectedEvent.prizePool.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.tracks && selectedEvent.tracks.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Tracks</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tracks.map((track, index) => (
                      <Badge key={index} variant="secondary">
                        {track}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowEventDetails(false);
                    onRegister?.();
                  }}
                >
                  Register Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowEventDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};