const express = require('express');
const router = express.Router();
const WaterIntake = require('../models/WaterIntake');
const auth = require('../middleware/auth');

// Log water intake
router.post('/', auth, async (req, res) => {
  try {
    const water = new WaterIntake({
      amount: req.body.amount,
      user: req.user.id
    });
    await water.save();
    res.status(201).json(water);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get today's water intake
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const water = await WaterIntake.find({ 
      user: req.user.id,
      date: { $gte: today } 
    });
    
    const total = water.reduce((sum, entry) => sum + entry.amount, 0);
    
    res.json({ total, entries: water });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;