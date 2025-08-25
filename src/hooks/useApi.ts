import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // User operations
  const createUser = (userData: any) => 
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

  const loginUser = (credentials: any) => 
    apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

  const getUser = (email: string) => 
    apiCall(`/users/${email}`);

  const getAllUsers = () => 
    apiCall('/users');

  // Project operations
  const createProject = (projectData: any) => 
    apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });

  const getProjects = () => 
    apiCall('/projects');

  // Event operations
  const createEvent = (eventData: any) => 
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });

  const getEvents = () => 
    apiCall('/events');

  const joinEvent = (eventId: string, userId: string) => 
    apiCall(`/events/${eventId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

  // Rating operations
  const createRating = (ratingData: any) => 
    apiCall('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });

  const getRatings = () => 
    apiCall('/ratings');

  // Team operations
  const createTeam = (teamData: any) => 
    apiCall('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });

  const getTeams = () => 
    apiCall('/teams');

  const inviteToTeam = (teamId: string, email: string, invitedBy: string) => 
    apiCall(`/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, invitedBy }),
    });

  const joinTeam = (teamId: string, userId: string, inviteId?: string) => 
    apiCall(`/teams/${teamId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId, inviteId }),
    });

  const addTeamMember = (teamId: string, email: string, addedBy: string) => 
    apiCall(`/teams/${teamId}/add-member`, {
      method: 'POST',
      body: JSON.stringify({ email, addedBy }),
    });

  const removeTeamMember = (teamId: string, userId: string, removedBy: string) => 
    apiCall(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({ removedBy }),
    });

  const declineInvite = (teamId: string, inviteId: string) => 
    apiCall(`/teams/${teamId}/decline-invite/${inviteId}`, {
      method: 'PUT',
    });

  // Announcement operations
  const createAnnouncement = (announcementData: any) => 
    apiCall('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });

  const getAnnouncements = (eventId?: string) => 
    apiCall(`/announcements${eventId ? `?eventId=${eventId}` : ''}`);

  // Q&A operations
  const createQuestion = (questionData: any) => 
    apiCall('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });

  const getQuestions = (eventId?: string) => 
    apiCall(`/questions${eventId ? `?eventId=${eventId}` : ''}`);

  const answerQuestion = (questionId: string, answer: string, answeredBy: string) => 
    apiCall(`/questions/${questionId}/answer`, {
      method: 'PUT',
      body: JSON.stringify({ answer, answeredBy }),
    });

  // Analytics operations
  const getAnalytics = (eventId: string) => 
    apiCall(`/analytics/${eventId}`);

  return {
    loading,
    error,
    createUser,
    loginUser,
    getUser,
    getAllUsers,
    createProject,
    getProjects,
    createEvent,
    getEvents,
    joinEvent,
    createRating,
    getRatings,
    createTeam,
    getTeams,
    inviteToTeam,
    joinTeam,
    addTeamMember,
    removeTeamMember,
    declineInvite,
    createAnnouncement,
    getAnnouncements,
    createQuestion,
    getQuestions,
    answerQuestion,
    getAnalytics,
  };
};