import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    db = client.db('ignite-forge-hub');
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Database name:', db.databaseName);
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':****@'));
  });

// Routes
app.post('/api/users', async (req, res) => {
  try {
    console.log('Creating user:', req.body.email);
    
    if (!db) {
      console.log('❌ Database not connected');
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: req.body.email });
    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      createdAt: new Date()
    };
    
    console.log('Inserting user data:', { ...userData, password: '****' });
    
    const result = await db.collection('users').insertOne(userData);
    console.log('✅ User created with ID:', result.insertedId);
    
    res.json({ id: result.insertedId });
  } catch (error) {
    console.error('❌ Create user error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    
    if (!db) {
      console.log('❌ Database not connected');
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { email, password } = req.body;
    console.log('Looking for user with email:', email);
    
    const user = await db.collection('users').findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Password match:', user.password === password ? 'Yes' : 'No');
    
    if (user.password !== password) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful');
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const user = await db.collection('users').findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json(users || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { eventId, submittedBy } = req.body;
    
    // Validate event exists and is active
    if (eventId) {
      const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if (event.status !== 'active') {
        return res.status(400).json({ error: 'Can only submit to active events' });
      }
      
      if (!event.participants?.includes(submittedBy)) {
        return res.status(403).json({ error: 'Must join event before submitting' });
      }
      
      // Check for duplicate submissions
      const existingSubmission = await db.collection('projects').findOne({
        eventId,
        submittedBy
      });
      
      if (existingSubmission) {
        return res.status(400).json({ error: 'Already submitted to this event' });
      }
    }
    
    const result = await db.collection('projects').insertOne({
      ...req.body,
      submissionDate: new Date(),
      createdAt: new Date()
    });
    
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const projects = await db.collection('projects').find({}).toArray();
    res.json(projects || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Event routes
app.post('/api/events', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const now = new Date();
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    // Auto-determine status based on dates
    let status = 'upcoming';
    if (now >= startDate && now <= endDate) {
      status = 'active';
    } else if (now > endDate) {
      status = 'completed';
    }
    
    const result = await db.collection('events').insertOne({
      ...req.body,
      status,
      participants: [],
      judges: req.body.judges || [],
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    // Update event statuses based on current time
    const now = new Date();
    await db.collection('events').updateMany(
      { 
        startDate: { $lte: now },
        endDate: { $gte: now },
        status: 'upcoming'
      },
      { $set: { status: 'active' } }
    );
    
    await db.collection('events').updateMany(
      { 
        endDate: { $lt: now },
        status: { $in: ['upcoming', 'active'] }
      },
      { $set: { status: 'completed' } }
    );
    
    const events = await db.collection('events').find({}).toArray();
    res.json(events || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events/:eventId/join', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const { eventId } = req.params;
    const { userId } = req.body;
    
    // Check if event exists and is joinable
    const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (event.status === 'completed') {
      return res.status(400).json({ error: 'Cannot join completed event' });
    }
    
    if (event.maxParticipants && event.participants?.length >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    if (event.participants?.includes(userId)) {
      return res.status(400).json({ error: 'Already joined this event' });
    }
    
    await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { participants: userId } }
    );
    
    res.json({ success: true, message: 'Successfully joined event' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rating routes
app.post('/api/ratings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { projectId, judgeId, eventId } = req.body;
    
    // Validate project exists
    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Validate event and judge assignment if eventId is provided
    if (eventId) {
      const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if (event.judges && !event.judges.includes(judgeId)) {
        return res.status(403).json({ error: 'Not assigned as judge for this event' });
      }
    }
    
    // Check for duplicate rating
    const existingRating = await db.collection('ratings').findOne({
      projectId,
      judgeId
    });
    
    if (existingRating) {
      // Update existing rating
      await db.collection('ratings').updateOne(
        { projectId, judgeId },
        { 
          $set: {
            ...req.body,
            updatedAt: new Date()
          }
        }
      );
      res.json({ success: true, message: 'Rating updated' });
    } else {
      // Create new rating
      const result = await db.collection('ratings').insertOne({
        ...req.body,
        createdAt: new Date()
      });
      res.json({ id: result.insertedId });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ratings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const ratings = await db.collection('ratings').find({}).toArray();
    res.json(ratings || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team routes
app.post('/api/teams', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const result = await db.collection('teams').insertOne({
      ...req.body,
      members: [req.body.leaderId],
      invites: [],
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teams', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const teams = await db.collection('teams').find({}).toArray();
    res.json(teams || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamId/invite', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { teamId } = req.params;
    const { email, invitedBy } = req.body;
    
    const team = await db.collection('teams').findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (!team.members.includes(invitedBy)) {
      return res.status(403).json({ error: 'Only team members can send invites' });
    }
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with this email not found' });
    }
    
    if (team.members.includes(user._id.toString())) {
      return res.status(400).json({ error: 'User is already a team member' });
    }
    
    const existingInvite = team.invites?.find(inv => inv.email === email && inv.status === 'pending');
    if (existingInvite) {
      return res.status(400).json({ error: 'User already has a pending invitation' });
    }
    
    const invite = {
      id: new ObjectId(),
      email,
      invitedBy,
      status: 'pending',
      createdAt: new Date()
    };
    
    await db.collection('teams').updateOne(
      { _id: new ObjectId(teamId) },
      { $push: { invites: invite } }
    );
    
    res.json({ success: true, inviteId: invite.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamId/join', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { teamId } = req.params;
    const { userId, inviteId } = req.body;
    
    const team = await db.collection('teams').findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (inviteId) {
      const invite = team.invites?.find(inv => inv.id.toString() === inviteId);
      if (!invite || invite.status !== 'pending') {
        return res.status(400).json({ error: 'Invalid or expired invite' });
      }
      
      await db.collection('teams').updateOne(
        { _id: new ObjectId(teamId) },
        { 
          $addToSet: { members: userId },
          $set: { 'invites.$[elem].status': 'accepted' }
        },
        { arrayFilters: [{ 'elem.id': new ObjectId(inviteId) }] }
      );
    } else {
      await db.collection('teams').updateOne(
        { _id: new ObjectId(teamId) },
        { $addToSet: { members: userId } }
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamId/add-member', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { teamId } = req.params;
    const { email, addedBy } = req.body;
    
    const team = await db.collection('teams').findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (team.leaderId !== addedBy) {
      return res.status(403).json({ error: 'Only team leader can add members directly' });
    }
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (team.members.includes(user._id.toString())) {
      return res.status(400).json({ error: 'User is already a team member' });
    }
    
    await db.collection('teams').updateOne(
      { _id: new ObjectId(teamId) },
      { $addToSet: { members: user._id.toString() } }
    );
    
    res.json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Announcement routes
app.post('/api/announcements', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const result = await db.collection('announcements').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/announcements', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const { eventId } = req.query;
    const filter = eventId ? { eventId } : {};
    const announcements = await db.collection('announcements')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(announcements || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q&A routes
app.post('/api/questions', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const result = await db.collection('questions').insertOne({
      ...req.body,
      answer: null,
      answeredBy: null,
      answeredAt: null,
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const { eventId } = req.query;
    const filter = eventId ? { eventId } : {};
    const questions = await db.collection('questions')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(questions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/questions/:questionId/answer', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { questionId } = req.params;
    const { answer, answeredBy } = req.body;
    
    await db.collection('questions').updateOne(
      { _id: new ObjectId(questionId) },
      { 
        $set: {
          answer,
          answeredBy,
          answeredAt: new Date()
        }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics routes
app.get('/api/analytics/:eventId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { eventId } = req.params;
    
    const [event, projects, ratings] = await Promise.all([
      db.collection('events').findOne({ _id: new ObjectId(eventId) }),
      db.collection('projects').find({ eventId }).toArray(),
      db.collection('ratings').find({ eventId }).toArray()
    ]);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const analytics = {
      totalParticipants: event.participants?.length || 0,
      totalSubmissions: projects.length,
      totalRatings: ratings.length,
      averageRating: ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.overallScore, 0) / ratings.length 
        : 0,
      submissionsByTrack: projects.reduce((acc, p) => {
        acc[p.track] = (acc[p.track] || 0) + 1;
        return acc;
      }, {}),
      judgeProgress: ratings.reduce((acc, r) => {
        acc[r.judgeId] = (acc[r.judgeId] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/teams/:teamId/members/:userId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { teamId, userId } = req.params;
    const { removedBy } = req.body;
    
    const team = await db.collection('teams').findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (team.leaderId !== removedBy && userId !== removedBy) {
      return res.status(403).json({ error: 'Only team leader or the member themselves can remove from team' });
    }
    
    if (team.leaderId === userId) {
      return res.status(400).json({ error: 'Team leader cannot be removed' });
    }
    
    await db.collection('teams').updateOne(
      { _id: new ObjectId(teamId) },
      { $pull: { members: userId } }
    );
    
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/teams/:teamId/decline-invite/:inviteId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { teamId, inviteId } = req.params;
    
    await db.collection('teams').updateOne(
      { _id: new ObjectId(teamId) },
      { $set: { 'invites.$[elem].status': 'declined' } },
      { arrayFilters: [{ 'elem.id': new ObjectId(inviteId) }] }
    );
    
    res.json({ success: true, message: 'Invitation declined' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db ? 'Connected' : 'Disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});n('ratings').findOne({
      projectId,
      judgeId
    });
    
    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this project' });
    }
    
    // Validate rating scores (1-10)
    const { scores } = req.body;
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ error: 'Scores object is required' });
    }
    
    const { innovation, technical, feasibility, presentation } = scores;
    if ([innovation, technical, feasibility, presentation].some(score => score < 1 || score > 10)) {
      return res.status(400).json({ error: 'Ratings must be between 1 and 10' });
    }
    
    const result = await db.collection('ratings').insertOne({
      ...req.body,
      ratedAt: new Date(),
      createdAt: new Date()
    });
    
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ratings/project/:projectId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const ratings = await db.collection('ratings').find({ projectId: req.params.projectId }).toArray();
    res.json(ratings || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json(users || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard endpoint
app.get('/api/events/:eventId/leaderboard', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { eventId } = req.params;
    
    // Get all projects for the event with their average ratings
    const leaderboard = await db.collection('projects').aggregate([
      { $match: { eventId } },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'projectId',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          averageScore: {
            $cond: {
              if: { $gt: [{ $size: '$ratings' }, 0] },
              then: { $avg: '$ratings.overall' },
              else: 0
            }
          },
          ratingCount: { $size: '$ratings' }
        }
      },
      { $sort: { averageScore: -1, ratingCount: -1 } }
    ]).toArray();
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Event statistics endpoint
app.get('/api/events/:eventId/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { eventId } = req.params;
    
    const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const projectCount = await db.collection('projects').countDocuments({ eventId });
    const ratingCount = await db.collection('ratings').countDocuments({ eventId });
    
    const stats = {
      participants: event.participants?.length || 0,
      maxParticipants: event.maxParticipants,
      submissions: projectCount,
      totalRatings: ratingCount,
      judges: event.judges?.length || 0,
      submissionRate: event.participants?.length > 0 ? (projectCount / event.participants.length * 100).toFixed(1) : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ratings routes
app.get('/api/ratings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const ratings = await db.collection('ratings').find({}).toArray();
    res.json(ratings || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ratings/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('ratings').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Teams routes
app.post('/api/teams', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('teams').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teams', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const teams = await db.collection('teams').find({}).toArray();
    res.json(teams || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teams/event/:eventId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const teams = await db.collection('teams').find({ eventId: req.params.eventId }).toArray();
    res.json(teams || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamId/join', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const { userId } = req.body;
    await db.collection('teams').updateOne(
      { _id: new ObjectId(req.params.teamId) },
      { $addToSet: { members: userId } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamId/invite', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const { email } = req.body;
    await db.collection('teams').updateOne(
      { _id: new ObjectId(req.params.teamId) },
      { $push: { invites: { email, status: 'pending', sentAt: new Date() } } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Announcements routes
app.get('/api/announcements', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const announcements = await db.collection('announcements').find({}).sort({ createdAt: -1 }).toArray();
    res.json(announcements || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/announcements/:eventId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const announcements = await db.collection('announcements').find({ 
      $or: [{ eventId: req.params.eventId }, { eventId: { $exists: false } }]
    }).sort({ createdAt: -1 }).toArray();
    res.json(announcements || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('announcements').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Questions routes
app.get('/api/questions', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const questions = await db.collection('questions').find({}).sort({ createdAt: -1 }).toArray();
    res.json(questions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions/:eventId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const questions = await db.collection('questions').find({ 
      $or: [{ eventId: req.params.eventId }, { eventId: { $exists: false } }]
    }).sort({ createdAt: -1 }).toArray();
    res.json(questions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('questions').insertOne({
      ...req.body,
      isAnswered: false,
      createdAt: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, answeredAt: new Date(), isAnswered: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  POST /api/users');
  console.log('  POST /api/users/login');
  console.log('  GET  /api/users/:email');
  console.log('  POST /api/projects');
  console.log('  GET  /api/projects');
  console.log('  GET  /api/test');
});