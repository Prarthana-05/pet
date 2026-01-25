// server.js
const express = require("express");
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require("cors");

// ✅ Database
const connectDB = require('./config/db'); // Only call this once
connectDB();

// ✅ Models
const User = require('./models/User');
const Pet = require('./models/Pet');
const ChatMessage = require('./models/ChatMessage');

// ✅ HTTP & Socket.IO
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

// ✅ Middleware
app.use(cors({
  origin: [
     "http://localhost:3000",
     "http://localhost:5000",
    "https://pet-kwivz3hi4-prarthana-05s-projects.vercel.app",
    "https://prarthanaa-portfolio.netlify.app",
    "https://pet-nine-weld.vercel.app"
  ],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true // if you plan to send cookies or authorization headers
}));

app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const adoptionRequestRoutes = require('./routes/adoptionRequest');
const adoption = require("./routes/adoptionRequestRoutes");
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vetservices', vetRoutes);
app.use('/api/adoption-request', adoptionRequestRoutes);
app.use('/api/adoption-requests', adoption);
app.use('/api', chatRoutes);

// ✅ Example API route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name _id role');
    res.json(users);
  } catch (error) {
    console.error('Error in /api/users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Static Files
app.use('/pet-images', express.static(path.join(__dirname, 'pet-images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Socket.IO Setup
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join user-specific room
  socket.on('register', ({ userId }) => {
    socket.join(userId);
  });

  // Chat message handler
  socket.on('chat message', async (data) => {
    try {
      const savedMessage = await ChatMessage.create({
        senderId: data.senderId,
        recipientId: data.recipientId,
        senderRole: data.senderRole,
        message: data.message,
        createdAt: new Date()
      });
      io.to(data.recipientId).emit('chat message', savedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
