const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// Log meal
router.post('/', auth, async (req, res) => {
  try {
    const meal = new Meal({
      ...req.body,
      user: req.user.id
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get today's meals
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const meals = await Meal.find({ 
      user: req.user.id,
      date: { $gte: today } 
    });
    
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;