import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, MessageSquare, Send, User, Clock, Mail } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface CommunicationCenterProps {
  user: any;
  events: any[];
}

const CommunicationCenter: React.FC<CommunicationCenterProps> = ({ user, events }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
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
      
      // Filter announcements for judge's events
      const eventIds = events.map(e => e._id);
      const relevantAnnouncements = announcementsData.filter((a: any) => 
        !a.eventId || eventIds.includes(a.eventId) || a.targetAudience === 'judges' || a.targetAudience === 'all'
      );
      
      setAnnouncements(relevantAnnouncements);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!questionTitle.trim() || !newQuestion.trim()) {
      toast.error('Please fill in both title and question');
      return;
    }

    try {
      await api.createQuestion({
        title: questionTitle,
        question: newQuestion,
        askedBy: user._id,
        askedByName: user.name,
        eventId: events[0]?._id || null // Associate with first event if available
      });
      
      toast.success('Question submitted successfully!');
      setQuestionTitle('');
      setNewQuestion('');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit question');
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

  const myQuestions = questions.filter((q: any) => q.askedBy === user._id);
  const unansweredQuestions = myQuestions.filter((q: any) => !q.answer);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Communication Center</h2>
        <p className="text-muted-foreground">Stay connected with organizers and get updates</p>
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
                <p className="text-xs text-muted-foreground">Announcements</p>
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
                <p className="text-lg font-semibold">{myQuestions.length}</p>
                <p className="text-xs text-muted-foreground">My Questions</p>
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
                <p className="text-xs text-muted-foreground">Pending Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {myQuestions.filter((q: any) => q.answer).length}
                </p>
                <p className="text-xs text-muted-foreground">Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>
              Latest updates from event organizers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {announcements.length > 0 ? (
                announcements.map((announcement: any) => (
                  <div key={announcement._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(announcement.priority)}>
                          {announcement.priority || 'normal'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(announcement.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {announcement.authorName || 'Organizer'}
                      {announcement.eventId && (
                        <>
                          <span>•</span>
                          <span>{events.find(e => e._id === announcement.eventId)?.title || 'Event'}</span>
                        </>
                      )}
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

        {/* Q&A Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask Questions
            </CardTitle>
            <CardDescription>
              Get help from event organizers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Submit Question Form */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="questionTitle">Question Title</Label>
                <Input
                  id="questionTitle"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Brief title for your question"
                />
              </div>
              <div>
                <Label htmlFor="newQuestion">Your Question</Label>
                <Textarea
                  id="newQuestion"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask your question here..."
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleSubmitQuestion} 
                disabled={api.loading}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {api.loading ? 'Submitting...' : 'Submit Question'}
              </Button>
            </div>

            <Separator />

            {/* My Questions */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <h4 className="font-medium">My Questions</h4>
              {myQuestions.length > 0 ? (
                myQuestions.map((question: any) => (
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
                          <User className="h-3 w-3" />
                          {question.answeredBy || 'Organizer'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Waiting for answer...
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions asked yet</p>
                  <p className="text-xs">Ask your first question above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Event Organizer Contacts</CardTitle>
          <CardDescription>
            Direct contact information for your assigned events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div key={event._id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{event.title}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Organizer: {event.organizerName || 'Event Organizer'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>Contact: {event.organizerId || 'organizer@event.com'}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events assigned</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationCenter;