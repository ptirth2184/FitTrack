const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  calories: { type: Number, required: true },
  time:     { type: String, required: true }, // e.g., Breakfast, Lunch
  date:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', MealSchema);
