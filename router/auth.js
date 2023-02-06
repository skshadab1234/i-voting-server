const express = require("express")
const router = express.Router()
const Admin = require("../models/admin_election_manager")
const Candidate = require('../models/CandidateSchema')
const bcrypt = require("bcryptjs")
const pageAuth = require("../middleware/pageAuth")

router.post('/admin_register', async (req,res) => {
    const { email, password } = req.body
    const testOn = true 
    try {
        const AdminExists = await Admin.findOne({email:email});

        if(AdminExists)
        {
            res.status(400).json({ message: "Admin Already Exists"});
        }else{
            const Admin = new Admin({email, password})
            await Admin.save();
            res.status(200).json({ message: "Registered Successfully"});
        }


    } catch (error) {
        console.log(error)
    }
})

// Login Route 
router.post("/admin_login",async (req, res) => {
    try {
        const {email, password} = req.body

        const AdminData = await Admin.findOne({email: email})

        if(!AdminData) {
            res.status(400).json({message: "Invalid Data"})
        }else{
            const isMatch = await bcrypt.compare(password, AdminData.password)
            if(isMatch){
                // Getting Generated Tokens 
                const token = await AdminData.generateAuthToken()
                
                res.cookie("evotingLoginToken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly:true
                })
                res.status(200).json({message: "Logged Successfully"})
            }else{
                res.status(400).json({message: "Invalid Credentials"})
            }
        }
    } catch (error) {
        console.log(error);
    }
})

// Profile Page Router
router.get("/admin_profile", pageAuth, (req,res) => {
    res.send(req.rootAdmin)
    // console.log(req.rootAdmin);   
})

// Add Candidate to Schema
router.post('/add_candidate', async (req,res) => {

    res.send(req.body)
    // Creating a new candidate
    const newCandidate = new Candidate(req.body);
    
    newCandidate.save((error) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send('Candidate created successfully!');
        }
    });  
})

// get all candidates list 
router.get('/getAllCandidate', (req, res) => {
    try {
        Candidate.find({}, function (err, candidates) {
          if (err) throw err;
          res.status(200).send(candidates);
        });
      } catch (error) {
        res.status(400).send(error);
      }  
})

// Get All Admin Data
router.get("/admin_all", (req,res) => {
    try {
        Admin.find({}, function (err, users) {
          if (err) throw err;
          res.status(200).send(users);
        });
      } catch (error) {
        res.status(400).send(error);
      }  
})

router.get("/admin_getdata", pageAuth, (req,res) => {
    res.send(req.rootAdmin)
    res.status(200).send("Admin Founded this Admin")
    // console.log(req.rootAdmin);
})

router.get("/admin_logout", (req,res) => {
    res.cookie('evotingLoginToken', '', { expires: new Date(1) });
    res.send('Cookie cleared');
})

module.exports = router