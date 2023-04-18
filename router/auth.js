const express = require("express")
const router = express.Router()
const Admin = require("../models/admin_election_manager")
const Candidate = require('../models/CandidateSchema')
const Voter = require("../models/voter")
const Position = require('../models/Positions')
const bcrypt = require("bcryptjs")
const pageAuth = require("../middleware/pageAuth")
const voterPageAuth = require("../middleware/voterPageAuth")
const moment = require('moment-timezone');
const Election = require("../models/Election")

router.post('/admin_register', async (req, res) => {
  const { email, password } = req.body
  const testOn = true
  try {
    const AdminExists = await Admin.findOne({ email: email });

    if (AdminExists) {
      res.status(400).json({ message: "Admin Already Exists" });
    } else {
      const Admin = new Admin({ email, password })
      await Admin.save();
      res.status(200).json({ message: "Registered Successfully" });
    }


  } catch (error) {
    console.log(error)
  }
})

// Login Route 
router.post("/admin_login", async (req, res) => {
  try {
    const { email, password } = req.body

    const AdminData = await Admin.findOne({ email: email })

    if (!AdminData) {
      res.status(400).json({ message: "Invalid Data" })
    } else {
      const isMatch = await bcrypt.compare(password, AdminData.password)
      if (isMatch) {
        // Getting Generated Tokens 
        const token = await AdminData.generateAuthToken()

        res.cookie("evotingLoginToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        res.status(200).json({ message: "Logged Successfully" })
      } else {
        res.status(400).json({ message: "Invalid Credentials" })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

// Profile Page Router
router.get("/admin_profile", pageAuth, (req, res) => {
  res.send(req.rootAdmin)
  // console.log(req.rootAdmin);   
})

// Add Candidate to Schema
router.post('/add_candidate', async (req, res) => {
  // Creating a new candidate
  try {
    const { name, party, platform, slogan, image } = req.body.values
    // console.log(name, party, platform, slogan) 
    const newCandidate = new Candidate({ name, party, platform, slogan, image })

    newCandidate.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Candidate saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });


  } catch (error) {
    console.log(error)
  }
})

// Update Candidate
router.post('/update_candidate', async (req, res) => {
  // Creating a new candidate
  try {
    const { selectedKey } = req.body
    const { name, party, platform, slogan, image } = req.body.values
    // console.log(name,party)
    Candidate.findByIdAndUpdate(selectedKey, { name, party, platform, slogan, image }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Candidate updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

router.post('/delete_candidate', async (req, res) => {
  // Creating a new candidate
  try {
    const { selectedKey } = req.body
    Candidate.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
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
router.get("/admin_all", (req, res) => {
  try {
    Admin.find({}, function (err, users) {
      if (err) throw err;
      res.status(200).send(users);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

router.get("/admin_getdata", pageAuth, (req, res) => {
  res.send(req.rootAdmin)
  res.status(200).send("Admin Founded this Admin")
  // console.log(req.rootAdmin);
})

router.get("/admin_logout", (req, res) => {
  res.cookie('evotingLoginToken', '', { expires: new Date(1) });
  res.send('Cookie cleared');
})

// get all candidates list 
router.get('/getAllVoter', (req, res) => {
  try {
    Voter.find({}, function (err, voters) {
      if (err) throw err;
      res.status(200).send(voters);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Voter Registration 
router.post('/add_voter', async (req, res) => {
  const { voterId, firstName, lastName, email, dateOfBirth, address, city, state, zipCode, phoneNumber, isVerified } = req.body.values
  const password = 'Shadabkhan123'
  try {

    const VoterExists = await Voter.findOne({ email: email });
    // console.log(VoterExists)
    if (VoterExists) {
      res.status(400).json({ status: 400, message: "Voter Already Exists" });
    } else {
      const newVoter = new Voter({ voterId, firstName, lastName, email, password, dateOfBirth, address, city, state, zipCode, phoneNumber, isVerified })
      newVoter.save(error => {
        if (error) {
          console.log("Error")
        } else {
          console.log('Voter Added Successfully')
          res.send({ status: 200, message: 'done' })
        }
      })
    }
  } catch (error) {
    console.log(error)
  }


})

// Update voter
router.post('/update_voter', async (req, res) => {
  // Creating a new voter
  try {
    const { selectedKey } = req.body

    const { voterId, firstName, lastName, email, dateOfBirth, address, city, state, zipCode, phoneNumber, isVerified } = req.body.values
    // console.log(name,party)
    Voter.findByIdAndUpdate(selectedKey, { voterId, firstName, lastName, email, dateOfBirth, address, city, state, zipCode, phoneNumber, isVerified }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Voter updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Delete Voter
router.post('/delete_voter', async (req, res) => {
  // Creating a new Voter
  try {
    const { selectedKey } = req.body
    Voter.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// Resgisteing Positions 
router.post('/add_position', async (req, res) => {
  const { name, description, image, date, time, status } = req.body.values

  try {
      const newPosition = new Position({ name: name, description: description, image: image,  date: date, time: time, status: parseInt(status) })
      newPosition.save(error => {
        if (error) {
          console.log("Error")
        } else {
          console.log('Position Added Successfully')
          res.send({ status: 200, message: 'done' })
        }
      })
    
  } catch (error) {
    console.log(error)
  }
}
)

// Get All Position Data
router.get("/getAllPositions", (req, res) => {
  try {
    Position.find({}, function (err, users) {
      if (err) throw err;
      res.status(200).send(users);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Update Positions
router.post('/update_position', async (req, res) => {
  // Creating a new voter
  try {
    const { selectedKey } = req.body

    const { name, description, image,  date, time, status } = req.body.values
    // console.log(name,party)
    Position.findByIdAndUpdate(selectedKey, { name, description, image,  date, time, status: parseInt(status) }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Positions updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Delete Positions
router.post('/delete_position', async (req, res) => {

  try {
    const { selectedKey } = req.body
    Position.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// Update Positions for Candidates
router.post('/updatePositioCandidatesList', async (req, res) => {
  try {
    const { selectedKey, selectedRowKeys } = req.body;

    const candidateObjects = selectedRowKeys.map((value) => ({ _id: value }));

    Position.findOne({ _id: selectedKey }, (error, position) => {
      if (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: 'Error finding position' });
      } else if (!position) {
        res.status(404).send({ status: 404, message: 'Position not found' });
      } else {
        const existingCandidateIds = position.candidates.map((candidate) => candidate._id);
        const newCandidateObjects = candidateObjects.filter((candidateObject) => !existingCandidateIds.includes(candidateObject._id));

        const updatedCandidates = position.candidates.filter((candidate) => {
          if (newCandidateObjects.some((obj) => obj._id === candidate._id)) {
            return true; // Don't remove candidates that are still in selectedRowKeys
          }
          return selectedRowKeys.includes(candidate._id); // Only keep candidates that are in selectedRowKeys
        });

        // Add the new candidates to the array
        newCandidateObjects.forEach((obj) => {
          updatedCandidates.push(obj);
        });

        Position.findByIdAndUpdate(
          selectedKey,
          { candidates: updatedCandidates },
          { new: true },
          (error) => {
            if (error) {
              console.log(error);
              res.status(500).send({ status: 500, message: 'Error updating position' });
            } else {
              console.log('Position updated successfully!');
              res.status(200).send({ status: 200, message: 'Position updated successfully' });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: 'Error updating position' });
  }
})

router.post('/updateVoterList', async (req, res) => {
  try {
    const { selectedKey, selectedRowKeys } = req.body;

    const voterObjects = selectedRowKeys.map((value) => ({ _id: value }));

    Position.findOne({ _id: selectedKey }, (error, position) => {
      if (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: 'Error finding Voter' });
      } else if (!position) {
        res.status(404).send({ status: 404, message: 'Voter not found' });
      } else {
        const existinVoter = position.Voters.map((voter) => voter._id);
        const newVoterObj = voterObjects.filter((voterObj) => !existinVoter.includes(voterObj._id));

        const updateVoter = position.Voters.filter((voter) => {
          if (newVoterObj.some((obj) => obj._id === voter._id)) {
            return true; // Don't remove voters that are still in selectedRowKeys
          }
          return selectedRowKeys.includes(voter._id); // Only keep voters that are in selectedRowKeys
        });

        // Add the new candidates to the array
        newVoterObj.forEach((obj) => {
          updateVoter.push(obj);
        });

        
        Position.findByIdAndUpdate(
          selectedKey,
          { Voters: updateVoter },
          { new: true },
          (error) => {
            if (error) {
              console.log(error);
              res.status(500).send({ status: 500, message: 'Error updating voter' });
            } else {
              console.log('Voter updated successfully!');
              res.status(200).send({ status: 200, message: 'Voter updated successfully' });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: 'Error updating position' });
  }
})


// Voter Login 
router.post("/login", async (req, res) => {
  try {
    const { voterId, password } = req.body

    const voterData = await Voter.findOne({ voterId: voterId })
    if (!voterData) {
      res.status(400).json({ message: "Invalid Data" })
    } else {
      const isMatch = await bcrypt.compare(password, voterData.password)
      console.log(isMatch);

      if (isMatch) {
        // Getting Generated Tokens 
        const token = await voterData.generateAuthToken()

        res.cookie("voter_evotingLoginToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        res.status(200).json({ message: "Logged Successfully" })
      } else {
        res.status(400).json({ message: "Invalid Credentials" })
      }
    }
  } catch (error) {
    console.log(error);
  }
})


// Profile Page Router
router.get("/voter_profile", voterPageAuth, (req, res) => {
  res.status(200).send({ status: 200, data: req.rootVoter })
})


router.get("/voter_logout", (req, res) => {
  res.cookie('voter_evotingLoginToken', '', { expires: new Date(1) });
  res.send('Cookie cleared');
})
module.exports = router


// Add Elections
router.post('/add_election', async (req, res) => {
  // Creating a new Election
  try {

    const { electionName, date, votingEligibility, pollingLocations, registrationDeadline, earlyVotingInformation, absenteeVotingInformation, voterIDRequirements, electionImage } = req.body.values
    // console.log(name, party, platform, slogan) 
    const newElection = new Election({ electionName, date, votingEligibility, pollingLocations, registrationDeadline, earlyVotingInformation, absenteeVotingInformation, voterIDRequirements, electionImage })

    newElection.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Election saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });


  } catch (error) {
    console.log(error)
  }
})

// Update Election
router.post('/update_election', async (req, res) => {
  try {
    const { selectedKey } = req.body
    const { positions } = req.body.values
    const postiArray = positions.split(',')
    const { electionName, date, votingEligibility, pollingLocations, registrationDeadline, earlyVotingInformation, absenteeVotingInformation, voterIDRequirements, electionImage } = req.body.values
    Election.findByIdAndUpdate(selectedKey, { electionName, date, votingEligibility, pollingLocations, registrationDeadline, earlyVotingInformation, absenteeVotingInformation, voterIDRequirements, electionImage, Positions: [postiArray] }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Election updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Get All Election Data
router.get("/getAllElections", (req, res) => {
  try {
    Election.find({}, function (err, users) {
      if (err) throw err;
      res.status(200).send(users);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


router.post('/delete_election', async (req, res) => {
  try {
    const { selectedKey } = req.body
    Election.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})
