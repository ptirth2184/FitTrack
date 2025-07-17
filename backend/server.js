require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Add these after auth routes
const workoutRoutes = require('./routes/workouts');
const waterRoutes = require('./routes/water');
const mealRoutes = require('./routes/meals');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test Route
app.get('/api/healthcheck', (req, res) => {
  res.send('Server is healthy');
});

app.use('/api/workouts', workoutRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/meals', mealRoutes);
