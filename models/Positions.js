const mongoose = require('mongoose');
const moment = require('moment-timezone');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  createdDate: {
    type: String,
    default: moment.tz('Asia/Kolkata').toDate()
  },
  status: {
    type: Number,
    default: 0
  },
});

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;