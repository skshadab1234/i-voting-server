const jwt = require("jsonwebtoken")
const Voter = require("../models/voter")

const voterPageAuth = async (req, res, next) => {
    try {
        const token = req.cookies.voter_evotingLoginToken // voter_evotingLoginToken ki jagah aapne token ka naam likhe
        const verifyToken = jwt.verify(token, process.env.SECRET_CHAR)

        const rootVoter = await Voter.findOne({ _id : verifyToken._id, "tokens.token" : token })

        if(!rootVoter) { throw new Error("Voter Data cannot find")}
        req.token = token;
        req.rootVoter = rootVoter;
        req.AdminId = rootVoter._id
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized: No token Found")
    }
}

module.exports = voterPageAuth