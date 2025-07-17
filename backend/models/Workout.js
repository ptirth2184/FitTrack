const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['cardio', 'strength', 'flexibility', 'balance'] 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  intensity: { 
    type: String, 
    enum: ['low', 'medium', 'high'] 
  },
  caloriesBurned: Number,
  notes: String,
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);