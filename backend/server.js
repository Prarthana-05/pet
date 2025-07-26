const express = require("express");
const cors = require("cors");
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const adoptionRequestRoutes = require('./routes/adoptionRequest');
const authMiddleware = require('./middleware/authMiddleware');


const adoption=require("./routes/adoptionRequestRoutes");



const app = express();

app.use(cors());  // ✅ FIRST — Enable CORS
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vetservices', vetRoutes);



app.use('/api/adoption-request', adoptionRequestRoutes);
app.use("/api/adoption-requests", adoption);

app.use('/pet-images', express.static(path.join(__dirname, 'pet-images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend')));


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
