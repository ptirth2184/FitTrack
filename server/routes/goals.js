const express = require('express');
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');
const router = express.Router();

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

// GET user's goals
router.get('/', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ user: req.user.userId });
    if (!goal) return res.json({});
    res.json(goal);
  } catch {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
});

// POST (create or update) user's goals
router.post('/', auth, async (req, res) => {
  try {
    const { workoutsPerWeek, dailyWaterMl, dailyCalories } = req.body;
    const updatedGoal = await Goal.findOneAndUpdate(
      { user: req.user.userId },
      { workoutsPerWeek, dailyWaterMl, dailyCalories },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updatedGoal);
  } catch {
    res.status(500).json({ message: "Failed to save goals" });
  }
});

module.exports = router;
