import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { db, User, Project, Event, Rating, Announcement, Question } from '@/lib/database';

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<User, '_id' | 'createdAt'> & { password: string }) => db.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => db.loginUser(email, password)
  });
};

export const useGetUser = (email: string) => {
  return useQuery({
    queryKey: ['user', email],
    queryFn: () => db.getUser(email),
    enabled: !!email,
    retry: false
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectData: Omit<Project, '_id' | 'createdAt'>) => db.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getProjects(),
    refetchInterval: 5000 // Refetch every 5 seconds
  });
};

// Event hooks
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventData: Omit<Event, '_id' | 'createdAt'>) => db.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
};

export const useGetEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => db.getEvents(),
    refetchInterval: 10000 // Refetch every 10 seconds
  });
};

export const useJoinEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) => db.joinEvent(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
};

// Rating hooks
export const useCreateRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ratingData: Omit<Rating, '_id' | 'createdAt'>) => db.createRating(ratingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    }
  });
};

export const useGetRatingsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['ratings', 'project', projectId],
    queryFn: () => db.getRatingsByProject(projectId),
    enabled: !!projectId
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => db.getUsers()
  });
};

export const useGetRatings = () => {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: () => db.getRatings(),
    refetchInterval: 5000 // Refetch every 5 seconds
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Rating>) => db.updateRating(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    }
  });
};

export const useGetAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => db.getAnnouncements(),
    refetchInterval: 3000 // Refetch every 3 seconds for real-time announcements
  });
};

export const useGetQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: () => db.getQuestions(),
    refetchInterval: 5000 // Refetch every 5 seconds
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionData: any) => db.createQuestion(questionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });
};

// Add real-time data hooks with refetch intervals
export const useGetTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => db.getTeams(),
    refetchInterval: 5000 // Refetch every 5 seconds for real-time updates
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamData: Omit<Team, '_id' | 'createdAt'>) => db.createTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
};

export const useJoinTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) => db.joinTeam(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (announcementData: Omit<Announcement, '_id' | 'createdAt'>) => db.createAnnouncement(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });
};

// Main useDatabase hook that exports all the individual hooks
export const useDatabase = () => {
  return {
    useEvents: useGetEvents,
    useProjects: useGetProjects,
    useRatings: useGetRatings,
    useTeams: useGetTeams,
    useAnnouncements: useGetAnnouncements,
    useQuestions: useGetQuestions,
    createRating: useCreateRating(),
    updateRating: useUpdateRating(),
    createQuestion: useCreateQuestion(),
    createTeam: useCreateTeam(),
    joinTeam: useJoinTeam(),
    createAnnouncement: useCreateAnnouncement()
  };
};