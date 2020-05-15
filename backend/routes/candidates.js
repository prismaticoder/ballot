var express = require('express');
var router = express.Router();
var models = require('../models'); // loads index.js
var { Candidate,Region } = models;
var cloudinary = require('cloudinary').v2;

//Display all *confirmed* candidates of a particular region
router.get('/', async (req, res) => {
    let { region }= res.locals;

    try {
        let categories = await region.getCategories();

        for (let i = 0; i < categories.length; i++) {
            let candidates = await categories[i].getCandidates();

            categories[i].candidates = candidates;   
        }
        // console.log(categories)
    
        return res.render('all-candidates', {
            page_name: "candidates",
            title: region.name + " Candidates",
            categories
        })  
    } catch (error) {
        console.error(error);
    }
    
})

//Candidate application form
router.get('/apply', (req, res) => {
    res.send("This is where the application form will be;")
})

//Application Success Page
router.post('/apply/success', (req, res) => {
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

//Display Single Candidate
router.get('/:id', (req, res) => {
    let { id } = req.params;

    res.send(`Single Candidate ${id}`)
})


module.exports = router;