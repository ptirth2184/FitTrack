const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/User');
const workoutRoutes = require('./routes/workout');
const waterRoutes = require('./routes/water');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/workout', workoutRoutes);
app.use('/water', waterRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
