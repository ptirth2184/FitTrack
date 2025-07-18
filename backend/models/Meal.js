const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  calories: { 
    type: Number, 
    required: true 
  },
  protein: Number,
  carbs: Number,
  fats: Number,
  mealType: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'] 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Meal', mealSchema);