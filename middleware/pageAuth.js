const jwt = require("jsonwebtoken")
const Admin = require("../models/admin_election_manager")

const pageAuth = async (req, res, next) => {
    try {
        const token = req.cookies.evotingLoginToken // evotingLoginToken ki jagah aapne token ka naam likhe
        const verifyToken = jwt.verify(token, process.env.SECRET_CHAR)

        const rootAdmin = await Admin.findOne({ _id : verifyToken._id, "tokens.token" : token })

        if(!rootAdmin) { throw new Error("Admin Data cannot find")}
        req.token = token;
        req.rootAdmin = rootAdmin;
        req.AdminId = rootAdmin._id
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized: No token Found")
    }
}

module.exports = pageAuth