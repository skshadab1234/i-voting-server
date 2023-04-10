const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ElectionSchema = new mongoose.Schema({
  electionName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  votingEligibility: {
    type: String,
    required: true
  },
  pollingLocations: {
    type: String,
    required: true
  },
  registrationDeadline: {
    type: String,
    required: true
  },
  earlyVotingInformation: {
    type: String,
    required: true
  },
  absenteeVotingInformation: {
    type: String,
    required: true
  },
  voterIDRequirements: {
    type: String,
    required: true
  },
  electionImage: {
    type: String,
    required: true
  },
  Positions: [{
    type: Array,
  }],
});

module.exports = mongoose.model('Election', ElectionSchema);
