const express = require("express");
const app = express();

const cors = require("cors");
const path = require('path');
const connectDB = require('./config/db');


const User = require('./models/User'); // ✅ Ensure correct path
const Pet = require('./models/Pet'); // or whatever folder Pet.js is in

const http = require('http');
const socketIo = require('socket.io');

const ChatMessage = require('./models/ChatMessage');

const server = http.createServer(app);

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const adoptionRequestRoutes = require('./routes/adoptionRequest');
const chatRoutes = require('./routes/chatRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const adoption = require("./routes/adoptionRequestRoutes");

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Database
connectDB();

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vetservices', vetRoutes);
app.use('/api/adoption-request', adoptionRequestRoutes);
app.use('/api/adoption-requests', adoption);
app.use('/api', chatRoutes);




app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name _id role'); // ✅ Only fetch needed fields
    console.log('Fetched users:', users); // ✅ Check if this runs
    res.json(users); // ✅ This must return an array
  } catch (error) {
    console.error('Error in /api/users:', error); // ✅ Log the real issue
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
  console.log('Saving message:', data);

  try {
    const savedMessage = await ChatMessage.create({
      senderId: data.senderId,
      recipientId: data.recipientId,
      senderRole: data.senderRole,
      message: data.message,
      createdAt: new Date() // Let Mongoose handle this instead if you want
    });

    console.log('✅ Message saved:', savedMessage);
    io.to(data.recipientId).emit('chat message', savedMessage);
  } catch (err) {
    console.error('❌ Error saving message:', err);
  }
});

});

// ✅ Start Server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
