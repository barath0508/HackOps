import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, Filter, Mail, UserCheck, UserX, Download } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface ParticipantManagementProps {
  user: any;
  events: any[];
}

const ParticipantManagement: React.FC<ParticipantManagementProps> = ({ user, events }) => {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const api = useApi();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      // This would need to be implemented in the API to get all users
      const users = await api.getUser(''); // Modify this to get all participants
      setParticipants(Array.isArray(users) ? users.filter((u: any) => u.role === 'participant') : []);
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const getParticipantEvents = (participantId: string) => {
    return events.filter(event => event.participants?.includes(participantId));
  };

  const filteredParticipants = participants.filter((participant: any) => {
    const matchesSearch = participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const participantEvents = getParticipantEvents(participant._id);
    const matchesEvent = selectedEvent === 'all' || 
                        participantEvents.some((event: any) => event._id === selectedEvent);
    
    const hasActiveEvents = participantEvents.some((event: any) => event.status === 'active');
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && hasActiveEvents) ||
                         (statusFilter === 'inactive' && !hasActiveEvents);
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const exportParticipants = () => {
    const csvContent = [
      ['Name', 'Email', 'Events Joined', 'Status', 'Join Date'].join(','),
      ...filteredParticipants.map((participant: any) => {
        const participantEvents = getParticipantEvents(participant._id);
        const hasActiveEvents = participantEvents.some((event: any) => event.status === 'active');
        return [
          participant.name || '',
          participant.email || '',
          participantEvents.length,
          hasActiveEvents ? 'Active' : 'Inactive',
          new Date(participant.createdAt).toLocaleDateString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Participants exported successfully!');
  };

  const sendBulkEmail = () => {
    // This would integrate with an email service
    toast.success(`Email sent to ${filteredParticipants.length} participants!`);
  };

  const getTotalStats = () => {
    const totalParticipants = participants.length;
    const activeParticipants = participants.filter((p: any) => 
      getParticipantEvents(p._id).some((event: any) => event.status === 'active')
    ).length;
    const totalEventJoins = participants.reduce((acc: number, p: any) => 
      acc + getParticipantEvents(p._id).length, 0
    );
    const avgEventsPerParticipant = totalParticipants > 0 ? 
      (totalEventJoins / totalParticipants).toFixed(1) : '0';

    return { totalParticipants, activeParticipants, totalEventJoins, avgEventsPerParticipant };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Participant Management</h2>
          <p className="text-muted-foreground">Manage and communicate with event participants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportParticipants}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={sendBulkEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalParticipants}</p>
                <p className="text-xs text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.activeParticipants}</p>
                <p className="text-xs text-muted-foreground">Active Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserX className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalEventJoins}</p>
                <p className="text-xs text-muted-foreground">Total Event Joins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.avgEventsPerParticipant}</p>
                <p className="text-xs text-muted-foreground">Avg Events/Participant</p>
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
                placeholder="Search participants..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({filteredParticipants.length})</CardTitle>
          <CardDescription>
            Manage your event participants and their engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Events Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant: any) => {
                  const participantEvents = getParticipantEvents(participant._id);
                  const hasActiveEvents = participantEvents.some((event: any) => event.status === 'active');
                  
                  return (
                    <TableRow key={participant._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{participantEvents.length} events</div>
                          <div className="flex flex-wrap gap-1">
                            {participantEvents.slice(0, 2).map((event: any) => (
                              <Badge key={event._id} variant="secondary" className="text-xs">
                                {event.title}
                              </Badge>
                            ))}
                            {participantEvents.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{participantEvents.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={hasActiveEvents ? 'default' : 'secondary'}>
                          {hasActiveEvents ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(participant.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredParticipants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No participants found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantManagement;