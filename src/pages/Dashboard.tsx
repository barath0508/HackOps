import React from 'react';
import { ParticipantDashboard } from "@/components/dashboard/ParticipantDashboard";
import { OrganizerDashboard } from "@/components/dashboard/OrganizerDashboard";
import { JudgeDashboard } from "@/components/dashboard/JudgeDashboard";
import ParticipantDashboardNew from '@/components/participant/EventDiscovery';
import OrganizerDashboardNew from '@/components/organizer/EventConfiguration';
import JudgeDashboardNew from '@/components/judge/AssignedEvents';

interface DashboardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'participant' | 'organizer' | 'judge';
    createdAt?: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const renderDashboard = () => {
    switch (user.role) {
      case 'participant':
        return <ParticipantDashboard userEmail={user.email} />;
      case 'organizer':
        return <OrganizerDashboard userEmail={user.email} />;
      case 'judge':
        return <JudgeDashboard user={user} />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h2>
              <p className="text-gray-600">Please contact support for assistance.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;