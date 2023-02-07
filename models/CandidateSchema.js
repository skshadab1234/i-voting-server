const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    party: {
        type: String,
    },
    platform: {
        type: String,
    },
    slogan: {
        type: String,
    },
    image: {
        type: String
    },
});

module.exports = mongoose.model('Candidate', CandidateSchema);
