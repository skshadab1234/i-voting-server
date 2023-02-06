const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Election', ElectionSchema);
