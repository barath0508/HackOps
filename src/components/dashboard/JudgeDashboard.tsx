import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MessageSquare, BarChart3, Trophy } from "lucide-react";
import AssignedEvents from "@/components/judge/AssignedEvents";
import ProjectReview from "@/components/judge/ProjectReview";
import JudgingProgress from "@/components/judge/JudgingProgress";
import CommunicationCenter from "@/components/judge/CommunicationCenter";

interface JudgeDashboardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const JudgeDashboard: React.FC<JudgeDashboardProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Judge Dashboard</h1>
                <p className="text-lg text-gray-600 mt-1">Review. Score. Provide Value.</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  Judge
                </Badge>
                <div className="text-right">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Assigned Events
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Project Review
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Progress Tracker
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                <AssignedEvents user={user} events={[]} onEventUpdate={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardContent className="p-6">
                <ProjectReview user={user} projects={[]} ratings={[]} onRatingSubmit={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardContent className="p-6">
                <JudgingProgress user={user} projects={[]} ratings={[]} events={[]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardContent className="p-6">
                <CommunicationCenter user={user} events={[]} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};