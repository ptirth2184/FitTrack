const express = require('express');
const jwt = require('jsonwebtoken');
const Workout = require('../models/Workout');
const router = express.Router();

// Middleware for JWT auth
function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// POST /workout — Create a workout log
router.post('/', auth, async (req, res) => {
  try {
    const { type, duration, calories } = req.body;
    const workout = new Workout({
      user: req.user.userId,
      type,
      duration,
      calories
    });
    await workout.save();
    res.status(201).json({ message: "Workout logged!" });
  } catch {
    res.status(500).json({ message: "Failed to log workout" });
  }
});

// GET /workouts — List workouts for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch {
    res.status(500).json({ message: "Unable to fetch workouts" });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, duration, calories } = req.body;
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { type, duration, calories },
      { new: true }
    );
    if (!updatedWorkout) return res.status(404).json({ message: "Workout not found" });
    res.json(updatedWorkout);
  } catch (err) {
    res.status(500).json({ message: "Failed to update workout" });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedWorkout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedWorkout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workout" });
  }
});


module.exports = router;
