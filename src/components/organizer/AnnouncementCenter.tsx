import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Bell, Plus, Send, MessageSquare, Users, Clock, AlertTriangle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface AnnouncementCenterProps {
  user: any;
  events: any[];
  onAnnouncementSent: () => void;
}

const AnnouncementCenter: React.FC<AnnouncementCenterProps> = ({ user, events, onAnnouncementSent }) => {
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventId: '',
    priority: 'normal',
    targetAudience: 'all'
  });
  const [answerData, setAnswerData] = useState<{[key: string]: string}>({});
  const api = useApi();

  useEffect(() => {
    loadData();
    // Set up polling for real-time updates
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [announcementsData, questionsData] = await Promise.all([
        api.getAnnouncements(),
        api.getQuestions()
      ]);
      setAnnouncements(announcementsData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.createAnnouncement({
        ...formData,
        authorId: user._id,
        authorName: user.name
      });
      
      toast.success('Announcement sent successfully!');
      setShowCreateAnnouncement(false);
      setFormData({
        title: '',
        content: '',
        eventId: '',
        priority: 'normal',
        targetAudience: 'all'
      });
      loadData();
      onAnnouncementSent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send announcement');
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerData[questionId];
    if (!answer?.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      await api.answerQuestion(questionId, answer, user.name);
      toast.success('Answer submitted successfully!');
      setAnswerData(prev => ({ ...prev, [questionId]: '' }));
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit answer');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Bell className="h-4 w-4" />;
      case 'low': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unansweredQuestions = questions.filter((q: any) => !q.answer);
  const recentAnnouncements = announcements.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Announcement Center</h2>
          <p className="text-muted-foreground">Send announcements and manage Q&A</p>
        </div>
        <Dialog open={showCreateAnnouncement} onOpenChange={setShowCreateAnnouncement}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Send an announcement to participants
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Announcement title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="eventId">Target Event</Label>
                  <Select value={formData.eventId} onValueChange={(value) => handleInputChange('eventId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Events</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Participants</SelectItem>
                      <SelectItem value="participants">Participants Only</SelectItem>
                      <SelectItem value="judges">Judges Only</SelectItem>
                      <SelectItem value="organizers">Organizers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your announcement content here..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={api.loading}>
                  {api.loading ? 'Sending...' : 'Send Announcement'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateAnnouncement(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{announcements.length}</p>
                <p className="text-xs text-muted-foreground">Total Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{questions.length}</p>
                <p className="text-xs text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{unansweredQuestions.length}</p>
                <p className="text-xs text-muted-foreground">Pending Questions</p>
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
                <p className="text-lg font-semibold">
                  {questions.filter((q: any) => q.answer).length}
                </p>
                <p className="text-xs text-muted-foreground">Answered Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
            <CardDescription>
              Your latest announcements to participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement: any) => (
                  <div key={announcement._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(announcement.priority)} className="flex items-center gap-1">
                          {getPriorityIcon(announcement.priority)}
                          {announcement.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(announcement.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {announcement.targetAudience} • {announcement.eventId ? 'Event specific' : 'All events'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No announcements yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Q&A Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Q&A Management
            </CardTitle>
            <CardDescription>
              Answer questions from participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.length > 0 ? (
                questions.map((question: any) => (
                  <div key={question._id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{question.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{question.question}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(question.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      Asked by {question.askedByName || 'Anonymous'}
                    </div>

                    {question.answer ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            Answered
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(question.answeredAt)}
                          </span>
                        </div>
                        <p className="text-sm">{question.answer}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Users className="h-3 w-3" />
                          {question.answeredBy}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Type your answer here..."
                          value={answerData[question._id] || ''}
                          onChange={(e) => setAnswerData(prev => ({ 
                            ...prev, 
                            [question._id]: e.target.value 
                          }))}
                          rows={2}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleAnswerQuestion(question._id)}
                          disabled={api.loading}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {api.loading ? 'Sending...' : 'Send Answer'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementCenter;