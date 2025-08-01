const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  workoutsPerWeek: { type: Number, default: 0 },
  dailyWaterMl: { type: Number, default: 0 },
  dailyCalories: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
