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
  res.render('index', { title: 'Home', page_name: "home" });
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

    return res.status(200).json(sendRes(data,200));
    
  } catch (err) {
    console.error(err)

    return res.status(500).json(sendError("Internal Server Error",200)); 
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
