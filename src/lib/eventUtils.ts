export const getEventStatus = (startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'completed' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'completed';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ongoing': return 'bg-green-500';
    case 'upcoming': return 'bg-blue-500';
    case 'completed': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};