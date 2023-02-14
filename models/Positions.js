const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }]
});

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;