import { api } from './mongodb';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'participant' | 'organizer' | 'judge';
  createdAt: Date;
}

export interface Event {
  _id?: string;
  name: string;
  title?: string;
  description: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  location?: string;
  maxParticipants?: number;
  prizePool?: string;
  status: 'upcoming' | 'active' | 'completed';
  organizerId: string;
  judges?: string[];
  participants?: string[];
  tracks?: string[];
  createdAt?: Date;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  teamName: string;
  teamMembers?: string[];
  submittedBy: string;
  eventId: string;
  track: string;
  githubUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  demoUrl?: string;
  technologies?: string[];
  status: 'draft' | 'submitted' | 'reviewed';
  submissionDate: Date;
  createdAt?: Date;
}

export interface Rating {
  _id?: string;
  projectId: string;
  judgeId: string;
  eventId?: string;
  scores: {
    innovation: number;
    technical: number;
    feasibility: number;
    presentation: number;
  };
  totalScore: number;
  feedback: string;
  round?: number;
  createdAt?: Date;
}

export interface Team {
  _id?: string;
  name: string;
  description: string;
  leaderId: string;
  members: string[];
  eventId: string;
  invites: {
    email: string;
    status: 'pending' | 'accepted' | 'declined';
    sentAt: Date;
  }[];
  createdAt: Date;
}

export interface Announcement {
  _id?: string;
  eventId?: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'participants' | 'judges' | 'organizers';
  actionRequired?: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Question {
  _id?: string;
  eventId?: string;
  title: string;
  content: string;
  authorId: string;
  authorType: 'participant' | 'judge' | 'organizer';
  targetAudience: 'all' | 'participants' | 'judges' | 'organizers';
  isPublic: boolean;
  answer?: string;
  answeredBy?: string;
  answeredAt?: Date;
  isAnswered?: boolean;
  createdAt: Date;
}

export class DatabaseService {
  async createUser(user: Omit<User, '_id' | 'createdAt'> & { password: string }): Promise<string> {
    console.log('Database service - creating user:', user);
    const result = await api.post('/users', user);
    console.log('Database service - result:', result);
    return result.id;
  }

  async loginUser(email: string, password: string): Promise<User> {
    const result = await api.post('/users/login', { email, password });
    return result;
  }

  async getUser(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/${email}`);
      return response;
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null; // User not found is expected
      }
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  async createProject(project: Omit<Project, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/projects', project);
    return result.id;
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  // Event methods
  async createEvent(event: Omit<Event, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/events', event);
    return result.id;
  }

  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async joinEvent(eventId: string, userId: string): Promise<void> {
    await api.post(`/events/${eventId}/join`, { userId });
  }

  // Rating methods
  async createRating(rating: Omit<Rating, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/ratings', rating);
    return result.id;
  }

  async getRatingsByProject(projectId: string): Promise<Rating[]> {
    try {
      const response = await api.get(`/ratings/project/${projectId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  // Team methods
  async createTeam(team: Omit<Team, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/teams', team);
    return result.id;
  }

  async getTeamsByEvent(eventId: string): Promise<Team[]> {
    try {
      const response = await api.get(`/teams/event/${eventId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async joinTeam(teamId: string, userId: string): Promise<void> {
    await api.post(`/teams/${teamId}/join`, { userId });
  }

  async inviteToTeam(teamId: string, email: string): Promise<void> {
    await api.post(`/teams/${teamId}/invite`, { email });
  }

  // Communication methods
  async getAnnouncements(eventId: string): Promise<Announcement[]> {
    try {
      const response = await api.get(`/announcements/${eventId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async createQuestion(question: Omit<Question, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/questions', question);
    return result.id;
  }

  async getQuestions(eventId?: string): Promise<Question[]> {
    try {
      const url = eventId ? `/questions/${eventId}` : '/questions';
      const response = await api.get(url);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async getRatings(): Promise<Rating[]> {
    try {
      const response = await api.get('/ratings');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async updateRating(id: string, data: Partial<Rating>): Promise<void> {
    await api.put(`/ratings/${id}`, data);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await api.get('/announcements');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async createAnnouncement(announcement: Omit<Announcement, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/announcements', announcement);
    return result.id;
  }

  async getTeams(): Promise<Team[]> {
    try {
      const response = await api.get('/teams');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  }

  async createTeam(team: Omit<Team, '_id' | 'createdAt'>): Promise<string> {
    const result = await api.post('/teams', team);
    return result.id;
  }

  async joinTeam(teamId: string, userId: string): Promise<void> {
    await api.post(`/teams/${teamId}/join`, { userId });
  }
}

export const db = new DatabaseService();