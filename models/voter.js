const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var Schema = mongoose.Schema;

const voter = new mongoose.Schema({
    voterId: {
        type: String,
        required: true,
        unique: true
      },
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      votingRights: [{
        type: Schema.Types.ObjectId,
        ref: "Ballot"
      }],
      votesCast: [{
        type: Schema.Types.ObjectId,
        ref: "Vote"
      }],
      tokens: [{
        type: Schema.Types.ObjectId,
      }],
      dateOfBirth: {
        type: Date,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: true
      },
      isVerified: {
        type: Boolean,
        default: false
      }
})

// We are making our password hash
voter.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

// We are generating the tokens
voter.methods.generateAuthToken = async function() {
    try {
        let payload = {_id:this._id}
        let unique32Char = process.env.SECRET_CHAR
        let token = jwt.sign(payload,unique32Char)
        let last_login = new Date()
        // add this token to database
        this.tokens = this.tokens.concat({ token: token, last_login })
        await this.save()
        return token;
    } catch (error) {
        console.log(error);
    }
}

//Model 
const Voter = mongoose.model("Voter", voter)

// export MODULE TO  USE IN OTHER FILES 
module.exports = Voter