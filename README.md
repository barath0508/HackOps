# HackOps

A comprehensive hackathon management platform with role-based dashboards for participants, organizers, and judges.

## Features

### 🎯 **Role-Based Dashboards**
- **Participants**: "Build. Submit. Win." - Event discovery, team management, project submission
- **Organizers**: "Create. Manage. Engage." - Event configuration, participant management, announcements
- **Judges**: "Review. Score. Provide Value." - Project evaluation, progress tracking, communication

### 🚀 **Core Functionality**
- **Event Management**: Create and configure hackathons with tracks, prizes, and timelines
- **Team Formation**: Create teams, send invites, manage members
- **Project Submission**: Upload projects with GitHub links, demos, and documentation
- **Real-time Evaluation**: Multi-criteria scoring system with feedback
- **Live Communication**: Announcements, Q&A, and real-time updates

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **UI Components**: shadcn/ui
- **State Management**: React Query

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/barath0508/HackOps.git
cd HackOps
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001/api

# Backend (server/.env)
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

4. **Start the application**
```bash
# Start backend
cd server
node server.js

# Start frontend (new terminal)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

## Usage

### Getting Started
1. **Register** with your role (Participant/Organizer/Judge)
2. **Login** to access your role-specific dashboard
3. **Explore** features based on your role

### For Organizers
- Create events with detailed configuration
- Manage participants and judge assignments
- Send announcements and manage Q&A
- Track submissions and analytics

### For Participants
- Discover and join events
- Form teams and invite members
- Submit projects with documentation
- View live updates and announcements

### For Judges
- Review assigned events and projects
- Score submissions with detailed feedback
- Track judging progress
- Communicate with organizers

## API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/join` - Join event

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Submit project

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Submit rating

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details