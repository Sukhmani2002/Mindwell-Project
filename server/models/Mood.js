const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'calm', 'neutral', 'stressed', 'sad', 'angry']
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  note: {
    type: String,
    maxlength: 500,
    default: ''
  },
  activities: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);
