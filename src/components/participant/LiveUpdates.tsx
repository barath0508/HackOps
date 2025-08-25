import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, MessageCircle, Send, Clock, User, HelpCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface LiveUpdatesProps {
  user: any;
  announcements: any[];
}

const LiveUpdates: React.FC<LiveUpdatesProps> = ({ user, announcements }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const api = useApi();

  useEffect(() => {
    loadQuestions();
    // Set up polling for real-time updates
    const interval = setInterval(loadQuestions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQuestions = async () => {
    try {
      const questionsData = await api.getQuestions();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load questions:', error);
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
        eventId: null // Can be set to specific event if needed
      });
      
      toast.success('Question submitted successfully!');
      setQuestionTitle('');
      setNewQuestion('');
      loadQuestions();
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

  const getAnnouncementPriority = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Live Updates</h2>
        <p className="text-muted-foreground">Stay updated with announcements and ask questions</p>
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
                announcements.map((announcement) => (
                  <div key={announcement._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getAnnouncementPriority(announcement.priority)}>
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
              <MessageCircle className="h-5 w-5" />
              Q&A
            </CardTitle>
            <CardDescription>
              Ask questions and get answers from organizers
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

            {/* Questions List */}
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
                      <User className="h-3 w-3" />
                      Asked by {question.askedByName || 'Anonymous'}
                    </div>

                    {question.answer ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
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
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions yet</p>
                  <p className="text-xs">Be the first to ask a question!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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
                <MessageCircle className="h-4 w-4 text-green-600" />
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <HelpCircle className="h-4 w-4 text-purple-600" />
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
    </div>
  );
};

export default LiveUpdates;