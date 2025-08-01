const mongoose = require('mongoose');

const WaterLogSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:  { type: Number, required: true }, // in milliliters
  date:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaterLog', WaterLogSchema);
