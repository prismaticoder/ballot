var express = require('express');
var router = express.Router();
var models = require('../models');
var Config = models.Setting;
var { Admin } = models
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var { sendRes,sendError } = require('../controllers/res')
var dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({success: true, message: "Welcome to the Ballot API 😁"});
});


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
router.post('/accreditation', async (req, res) => {
  try {
    
    let { matric, code } = req.body;

    let student = await Voter.findOne({
      where: {
        matric,
        code
      }
    })

    if (!student) {
      sendError(res,404)
    }
    
    else {
      sendRes(res,student)
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
        sendError(res,404,"Incorrect username or password")
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

module.exports = router;
