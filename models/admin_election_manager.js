const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const adminSchema = new mongoose.Schema({
    email: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    middlename: {type: String},
    password: {type: String, required: true},
    tokens : [ { token : { type: String, required:true }, last_login : {type:String} } ],
    status: {type: Number},
    position: {type: String, required: true},
    joined_this_position_on: {type: String}
})

// We are making our password hash
adminSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

// We are generating the tokens
adminSchema.methods.generateAuthToken = async function() {
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
const Admin = mongoose.model("admin_election_manager", adminSchema)

// export MODULE TO  USE IN OTHER FILES 
module.exports = Admin