const express = require('express');
const jwt = require('jsonwebtoken');
const WaterLog = require('../models/WaterLog');
const router = express.Router();

// JWT auth middleware (reuse or import from auth.js if you have it)
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

// Log water intake
router.post('/', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const log = new WaterLog({ user: req.user.userId, amount });
    await log.save();
    res.status(201).json({ message: "Water logged!" });
  } catch {
    res.status(500).json({ message: "Unable to log water" });
  }
});

// Get today's water logs for the user
router.get('/', auth, async (req, res) => {
  try {
    // Get logs from start of today
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const logs = await WaterLog.find({
      user: req.user.userId,
      date: { $gte: start }
    }).sort({ date: -1 });
    res.json(logs);
  } catch {
    res.status(500).json({ message: "Unable to fetch water logs" });
  }
});

module.exports = router;
