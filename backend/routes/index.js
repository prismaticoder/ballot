var express = require('express');
var router = express.Router();
var models = require('../models'); // loads index.js
var Config = models.Setting;
var { sendRes,sendError } = require('../controllers/res')
const fetch = require('node-fetch');
var dotenv = require('dotenv');
dotenv.config();
var ok = true;

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
      sendRes(res,{student})
    }

  } catch (error) {
    console.error(error)
    sendError(res,500)
  }
})

router.get('/regions', async (req, res) => {
  //Fetch the regions from the API
  let regionsAPI = await fetch(`${process.env.BASE_URL}/api/regions`);
  regionsJSON = await regionsAPI.json()

  let { regions } = regionsJSON

  if (regionsJSON.ok) {
    return res.render('regions', {
      regions: regions.slice(0,21),
      title: "All Regions",
      page_name: "regions"
    })
  }
  return res.render('error')
})

module.exports = router;
