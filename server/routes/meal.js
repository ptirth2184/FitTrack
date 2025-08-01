const express = require('express');
const jwt = require('jsonwebtoken');
const Meal = require('../models/Meal');
const router = express.Router();

// JWT auth middleware (same as used elsewhere)
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

// POST /meals — Add meal
router.post('/', auth, async (req, res) => {
  try {
    const { name, calories, time } = req.body;
    const meal = new Meal({ user: req.user.userId, name, calories, time });
    await meal.save();
    res.status(201).json({ message: "Meal logged!" });
  } catch {
    res.status(500).json({ message: "Failed to log meal" });
  }
});

// GET /meals — Fetch user's meals (optionally filter by date)
router.get('/', auth, async (req, res) => {
  try {
    // Optionally filter by today's date
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const meals = await Meal.find({
      user: req.user.userId,
      date: { $gte: start }
    }).sort({ date: -1 });
    res.json(meals);
  } catch {
    res.status(500).json({ message: "Unable to fetch meals" });
  }
});

module.exports = router;
