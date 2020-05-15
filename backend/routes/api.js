var express = require('express');
var router = express.Router();

var { Op } = require('sequelize');
var models = require('../models'); // loads index.js
var { Category,Region,Candidate,Vote } = models;       // the model keyed by its name

// var Category = require('../models/category');

//Function for sorting the regions by alphabetical order
function sortRegion(a,b) {
    if (a.name < b.name) {
        return -1
      }
      else if (a.name > b.name) {
        return 1
      }
      else {
        return 0
      }
}

router.get('/categories', async (req, res) => {
    let categories = await Category.findAll();

    return res.json(categories)
})

//Get all Regions
router.get('/regions', async (req, res) => {
    try {
        let regions = await Region.findAll();

        regions.sort(sortRegion)

        return res.status(200).json({ok: true, regions})
    } catch (error) {
        return res.status(400).json({ok: false, message: "There was an error processing the request"})
    }
})

//Endpoint for searching through regions for a region
router.get('/regions/search', async (req, res) => {
    let { q } = req.query;
    try {
        var regions = [];
        if (q !== "") {
        regions = await Region.findAll({
            where: {
                name: {
                    [Op.like]: `%${q}%`
                }
            }
        })

        regions.sort(sortRegion)
        }
        else {
            regions = await Region.findAll();
            
            regions.sort(sortRegion)

            regions = regions.slice(0,21)
        }

    return res.json({ok:true,count:regions.length,regions:regions});
      } catch (error) {
        return res.status(400).json({"ok": false, "message": "Bad Request"})
      }
  })
  

module.exports = router;