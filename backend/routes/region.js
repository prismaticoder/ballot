var express = require('express');
var router = express.Router();

var models = require('../models'); // loads index.js
var { Category,Region,Candidate,Voter,Admin } = models;       // the model keyed by its name

router.get('/', (req, res) => {
    let { region } = res.locals;

    return res.render('region-index', {
        region,
        title: region.name,
        page_name: 'home'
    })
    // return res.status(200).json({ok: true, region})
})

//Student Personal Vote
router.get('/:student/vote', (req, res) => {
    res.send("Main Student Voting Page")
})

//Voter registration page
router.post('/verification', async (req, res) => {
    let { lastname,matric,studentNumber } = req.body;

    try {
        let voter = await Voter.findOne({
            where: {
                lastname,
                matric,
                voterNumber: studentNumber
            }
        })

        if (!voter) {
            return res.status(404).json({ok: false, message: "Invalid Credentials! Please check the details and try again"})
        }

        return res.status(200).json({ok: true, message: "Verification Successful", voter})
    } catch (error) {
            return res.status(400).json({ok: false, message: "Bad Request"})
    }
})

router.get('/complete-registration', async (req, res) => {
    let { voter } = req;

    return res.status(200).json({ok: true, voter})
})

router.post('/success', async (req,res) => {
    //Save the pin details
    //Send an email to the user if he has successfully registered via sendgrid
    //In the email, tell him you will send his unique voter ID to his mail later upon registration
    //Also in the email, tell him to ensure he keeps his pin(s) secret, and if he ever forgets, he is to meet the admin in person wit his/her ID card for remembering the pin

})


router.get('/admin/login', async (req, res) => {
    let { region,flash } = res.locals;
    res.render('admin-login', {
        region,
        flash,
        title: `${region.name} ADMIN LOGIN`,
        page_name: "Admin Login"
    })
})

router.post('/admin/login', async (req, res) => {
    let { region } = res.locals;

    let {username,password} = req.body;

    try {
        let verify = await Admin.findOne({
            where: {
                username,
                password,
                regionId: region.id
            }
        })

        if (!verify) {
            req.session.flash = {
                message: "Incorrect Username or Password"
            }
            return res.redirect(`/${region.slug}/admin/login`)
        }
        else {
            req.session.admin = region.slug;
            return res.redirect(`/${region.slug}/admin`)
        }
    } catch (error) {
        console.log(error)
    }

})

// router.get('/ca')

module.exports = router;