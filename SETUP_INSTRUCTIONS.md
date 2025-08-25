# Setup Instructions

## Prerequisites
1. Node.js installed
2. MongoDB installed (see MONGODB_SETUP.md)

## Installation Steps

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Start MongoDB
- **Local**: Run `mongod` or start MongoDB service
- **Atlas**: Update `server/.env` with your connection string

### 4. Start Backend Server
```bash
cd server
npm run dev
```
Server runs on http://localhost:3001

### 5. Start Frontend (in new terminal)
```bash
npm run dev
```
Frontend runs on http://localhost:5173

## Features Available

### All Users
- User registration and login with role selection
- Responsive design with modern UI

### Participants
- Create and manage projects
- View all projects in the system
- Project submission with team member details

### Organizers
- View all projects and participants
- Monitor project statistics
- Event management interface

### Judges
- Review and evaluate projects
- View project statistics
- Scoring and feedback system

## Database Collections
- `users`: User accounts with roles
- `projects`: Project submissions with team details

## API Endpoints
- `POST /api/users` - Create user
- `GET /api/users/:email` - Get user by email
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects

The website is now fully functional with MongoDB integration!