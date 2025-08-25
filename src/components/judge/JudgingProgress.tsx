import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Clock, CheckCircle, Star, Trophy } from 'lucide-react';

interface JudgingProgressProps {
  user: any;
  projects: any[];
  ratings: any[];
  events: any[];
}

const JudgingProgress: React.FC<JudgingProgressProps> = ({ user, projects, ratings, events }) => {
  const getEventProgress = (eventId: string) => {
    const eventProjects = projects.filter(p => p.eventId === eventId);
    const eventRatings = ratings.filter(r => r.eventId === eventId);
    const completionRate = eventProjects.length > 0 ? (eventRatings.length / eventProjects.length) * 100 : 0;
    
    return {
      totalProjects: eventProjects.length,
      ratedProjects: eventRatings.length,
      completionRate: Math.round(completionRate)
    };
  };

  const getOverallStats = () => {
    const totalProjects = projects.length;
    const totalRatings = ratings.length;
    const overallCompletion = totalProjects > 0 ? (totalRatings / totalProjects) * 100 : 0;
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.overallScore, 0) / ratings.length 
      : 0;

    return {
      totalProjects,
      totalRatings,
      overallCompletion: Math.round(overallCompletion),
      avgRating: Math.round(avgRating * 10) / 10,
      pendingReviews: totalProjects - totalRatings
    };
  };

  const getRatingDistribution = () => {
    const distribution = { excellent: 0, good: 0, average: 0, poor: 0 };
    
    ratings.forEach(rating => {
      if (rating.overallScore >= 8) distribution.excellent++;
      else if (rating.overallScore >= 6) distribution.good++;
      else if (rating.overallScore >= 4) distribution.average++;
      else distribution.poor++;
    });

    return distribution;
  };

  const getRecentActivity = () => {
    return ratings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(rating => {
        const project = projects.find(p => p._id === rating.projectId);
        const event = events.find(e => e._id === rating.eventId);
        return {
          ...rating,
          projectTitle: project?.title || 'Unknown Project',
          eventTitle: event?.title || 'Unknown Event'
        };
      });
  };

  const stats = getOverallStats();
  const distribution = getRatingDistribution();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Judging Progress</h2>
        <p className="text-muted-foreground">Track your evaluation progress and statistics</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.totalRatings}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
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
                <p className="text-lg font-semibold">{stats.pendingReviews}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.overallCompletion}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Event Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Event</CardTitle>
            <CardDescription>
              Your judging progress for each assigned event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => {
                const progress = getEventProgress(event._id);
                
                return (
                  <div key={event._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {progress.ratedProjects}/{progress.totalProjects} projects rated
                        </p>
                      </div>
                      <Badge variant={progress.completionRate === 100 ? 'default' : 'secondary'}>
                        {progress.completionRate}%
                      </Badge>
                    </div>
                    <Progress value={progress.completionRate} className="h-2" />
                  </div>
                );
              })}
              
              {events.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events assigned
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of your rating scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Excellent (8-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{distribution.excellent}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${ratings.length > 0 ? (distribution.excellent / ratings.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Good (6-7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{distribution.good}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${ratings.length > 0 ? (distribution.good / ratings.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Average (4-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{distribution.average}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ 
                        width: `${ratings.length > 0 ? (distribution.average / ratings.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Needs Work (1-3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{distribution.poor}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${ratings.length > 0 ? (distribution.poor / ratings.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest project evaluations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{activity.projectTitle}</p>
                  <p className="text-sm text-muted-foreground">{activity.eventTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {activity.overallScore}/10
                  </Badge>
                </div>
              </div>
            ))}
            
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No ratings submitted yet</p>
                <p className="text-sm">Start reviewing projects to see your activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgingProgress;