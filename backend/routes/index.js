var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', page_name: "home" });
});

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
