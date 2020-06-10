var express = require('express');
var router = express.Router();
var { customAlphabet } = require('nanoid')
var models = require('../models');
var Config = models.Setting;
var { Admin,Category,Candidate,Voter,Vote } = models
const Sequelize = require('sequelize')
var { Op } = Sequelize;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var { sendRes,sendError } = require('../controllers/res')
var { checkState,onlyPreVoting,onlyVoting,onlyPostVoting } = require('../controllers/middleware')
var dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({success: true, message: "Welcome to the Ballot API 😁"});
});

router.get('/ballotMainPage', async (req, res) => {
  try {
    
    let [ setting ] = await Config.findAll({
      attributes: ["startDate","endDate"]
    });

    let candidateCount = await Candidate.count({
      where: {
          status: 'confirmed'
      }
    })

    let categoryCount = await Category.count()

    return sendRes(res,{setting, candidateCount, categoryCount})

  } catch (error) {
    console.error(error)
    return sendError(res,500)
  }
})

//Check the state of the application
router.get('/checkappstate', async (req, res) => {
  try {
    
    let [ config ] = await Config.findAll();

    if (config) {

      var currentTime = new Date()
      , hasStarted = currentTime >= config.startDate
      , hasEnded = currentTime >= config.endDate
      , data = {};

      if (!hasStarted && !hasEnded) {
        data.state = "prevoting"
      }

      else if (hasStarted && !hasEnded) {
        data.state = "voting";
      }

      else {
        data.state = "postvoting"
      }
    }

    else {
      data.state = "prevoting"
    }

    sendRes(res,data)
    
  } catch (err) {
    console.error(err)

    sendError(res,500); 
  }
})

//Check if user has accreeditation code and if so accredit him/her
router.post('/accredit', onlyPreVoting, async (req, res) => {
  try {

    let { matric, lastName } = req.body;

    if (matric && lastName) {
      let student = await Voter.findOne({
        where: {
          matric
        }
      })
  
      if (!student) {
        sendError(res,404,"Student not found")
      }
      
      else {
        if (student.lastName.toLowerCase() != lastName.toLowerCase()) {
          sendError(res,404,"Error: Credentials do not match")
        }

        else {

          if (!student.accreditedAt) {

            if (!student.voterCode) {

              //generate the voter code
              let nanoid = customAlphabet('123456789abcdefghjkmnpqrstuvwxyz', 6)

              let voterCode = nanoid()

              console.log(voterCode)
              student.voterCode = voterCode;

              await student.save()

              //create a never expiring jwt
              let voteToken = jwt.sign(
                {voterCode: student.voterCode, voterId: student.id, matric: student.matric},
                process.env.TOKEN_SECRET_KEY
                )
              //This is where a mail is sent to the student
              //await sendMail(student.prospectiveMail, voteToken)

              sendRes(res,{student})
            }

            else {
              sendError(res,403,"You have been sent your voter's number but are yet to confirm accreditation. Please click the confirmation link in the mail sent to you.")
            }
          }

          else {
            sendError(res,403,"You have already been accredited and given a voter's number")
          }
        }
      }
  
    }

    else {
      sendError(res,400,"Bad Request")
    }

  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})

//Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    
    let { username, password } = req.body;

    let admin = await Admin.findOne({
      where: {
        username
      }
    })


    if (!admin) {
      sendError(res,404,"User Not Found")
    }

    else {
      let valid = await bcrypt.compare(password, admin.password);

      if (!valid) {
        return sendError(res,404,"Incorrect username or password")
      } 

      let token = jwt.sign(
        {username: admin.username},
        process.env.TOKEN_SECRET_KEY,
        {expiresIn: '24h'}
        )

      sendRes(res,{username: admin.username, token})
    }


  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})

router.get('/confirm-accreditation', async (req, res) => {
  try {
    
    let { code } = req.query;

    if (code) {
      jwt.verify(code,process.env.TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            sendError(res,403,err)
        }
        else {
            let { voterCode, voterId, matric } = decoded
            
            let voter = await Voter.findOne({
              where: {
                id: voterId,
                matric
              }
            })

            if (voter) {
              if (voter.voterCode == voterCode) {

                if (voter.accreditedAt) {
                  return sendError(res,403,"You have already been confirmed as a voter in this election")
                }

                else {
                  voter.accreditedAt = new Date()
                  await voter.save()

                  return sendRes(res,{message: "You have successfully been accredited as a voter in the upcoming election. Do ensure that you keep the code sent to you in your mail secure as you would be needing it to participate in the election. Cheers :)"})
                }

              }

              else {
                return sendError(res,403,"Invalid Credentials")
              }
            }

            else {
              return sendError(res,404,"Voter Not Found")
            }
        }
      })
    }

    else {
      return sendError(res,400)
    }



  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})

router.get('/categories', async (req, res) => {

  try {
      let categories = await Category.findAll({
        attributes: ["id","name"]
      });

      sendRes(res,{categories})

  } catch (error) {

      console.error(error)
      sendError(res,500)
  }
})

//Now for voting

router.post('/voter/verify', onlyVoting, async (req, res) => {
  let { matric, voterCode } = req.body;

  if (matric && voterCode) {
    try {
      let voter = await Voter.findOne({
        where: {
          matric
        },
      })

      if (voter) {
        if (voter.accreditedAt) {
          if (voter.voterCode == voterCode) {

            //Now check if the person has voted

            let vote = await Vote.findOne({
              where: {
                  voterId: voter.id,
                  updatedAt: {
                      [Op.gte] : res.locals.startDate,
                      [Op.lte] : res.locals.endDate
                  }
              }
            })

            if (vote) {
              return sendError(res,403,"You have already voted in this election")
            }

            else {
              let token = jwt.sign(
                {voterCode: voter.voterCode, voterId: voter.id},
                process.env.TOKEN_SECRET_KEY,
                {expiresIn: '1h'}
                )
    
              sendRes(res,{name: voter.fullName, voteToken: token})
            }
            
          }
  
          else {
            sendError(res,403,"Incorrect credentials")
          }
        }

        else {
          sendError(res,403,"You are yet to confirm accreditation for this election")
        }
        

      }

      else {
        sendError(res,404,"Student not found")
      }

    } catch (error) {
      console.error(error)
      sendError(res,500)
    }
  }

  else {
    sendError(res,400)
  }
})

router.get('/stats', onlyVoting, async (req, res) => {

  let maxLevel = process.env.HIGHEST_LEVEL;
  let levels = []

  try {
    
    for (let i = 100; i <= maxLevel; i+=100) {
      levels.push(i)
    }
  
    let voters = await Voter.findAll({
      include: {
        model: Vote,
        as: "votes",
        where: {
          updatedAt: {
            [Op.gte] : res.locals.startDate,
            [Op.lte] : res.locals.endDate
          }
        }
      }
    })
  
    let resultArray = [];
  
    levels.forEach(level => {
      let count = voters.filter(voter => voter.level == level).length
      resultArray.push({level,count})
    })

    sendRes(res,{stats: resultArray})

  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})


router.get('/results', onlyPostVoting, async (req, res) => {
  try {

    if (res.locals.isApproved) {

      let levels = []
      let attributeArray = []

      for (let i = 100; i <= process.env.HIGHEST_LEVEL; i+=100) {
        levels.push(i)
      }

      levels.forEach((level,index) => {
        attributeArray.push([Sequelize.fn('SUM', Sequelize.where(Sequelize.col('candidates.Voters.level') , level)), `voteCount${index + 1}`])
      })


      let categories = await Category.findAll({
        attributes: ["id","name"],
        include: {
          model: Candidate,
          attributes: ["id","firstName","lastName","alias","fullName","level","matric",[Sequelize.fn('COUNT', Sequelize.col('candidates.Voters.id')), 'voteCount']],
          as: "candidates",
          where: {
              status: "confirmed"
          },
          include: [{
            model: Voter,
            through: {
              where: {
                updatedAt: {
                  [Op.gte] : res.locals.startDate,
                  [Op.lte] : res.locals.endDate
                }
              },
              attributes: [],
              required: false
            },
            as: "voters",
            attributes: attributeArray,
            required: false
          }]
        },
        group: ['candidates.id'],
        order: [['id','asc']]
      })
  
      let totalVotes = await Vote.aggregate('voterId','count', { distinct: true, where: {
        updatedAt: {
          [Op.gte] : res.locals.startDate,
          [Op.lte] : res.locals.endDate
        }
      }  })
  
      return sendRes(res,{categories, totalVotes})
  
    }

    else {
      return sendError(res,403,`Please wait for the results to be approved by the ${process.env.APP_TYPE}'s electoral committee`)
    }
    
    
  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})

module.exports = router;
