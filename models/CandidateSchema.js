const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    slogan: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    elections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election'
    }]
});

module.exports = mongoose.model('Candidate', CandidateSchema);
