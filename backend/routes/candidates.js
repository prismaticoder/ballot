var express = require('express');
var router = express.Router();
var models = require('../models'); // loads index.js
var { Candidate,Category } = models;
var { sendRes,sendError } = require('../controllers/res')
var cloudinary = require('cloudinary').v2;

//Display all *confirmed* candidates of a particular region
router.get('/', async (req, res) => {

    try {
        
        let categories = await Category.findAll({
            include: {
                model: Candidate,
                as: "candidates",
                where: {
                    status: "confirmed"
                }
            }
        })
        sendRes(res,{categories})
        
    } catch (error) {
        console.error(error);
        sendError(res,500)
    }
    
})

//Display Single Candidate
router.get('/:id', async (req, res) => {
    let { id } = req.params;

    try {
        
        let candidate = await Candidate.findOne({
            where: {
                id,
                status: "confirmed"
            },
            include: {
                attributes: ['name'],
                model: Category,
                as: "category"
            }
        })

        if (candidate) {
            sendRes(res,candidate)
        }
        else {
            sendError(res,404)
        }

    } catch (error) {
        console.error(error)
        sendError(res, 500)
    }
})


//Candidate Applying For A Position
router.post('/apply', (req, res) => {
    res.send("Your application is successful but pending")
})

//Check application status, a middleware should be here for login, or one can just use passport to check if the application code matches
router.get('/application-status', async (req, res) => {
    let { region } = res.locals;

    if (req.query.userCode) {
        let { userCode } = req.query

        let [ candidate ] = await region.getCandidates({
            where: {
                statusCode: userCode
            }
        })

        if (!candidate) {
            return res.status(404).json({ok:false, message: "No Candidate with the requested statuscode"})
        }
        return res.render('application-status', {
            candidate,
            region,
            page_name: "Candidates",
            title:"Check Application Status"
        })
    }
    else {
        return res.render('application-check', {
            page_name: "Candidates",
            title: "Check Application Status"
        })
    }
})


module.exports = router;