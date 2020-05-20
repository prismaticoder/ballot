var express = require('express');
var router = express.Router();
var nanoid = require('nanoid')
var models = require('../models'); // loads index.js
var { Candidate,Category,Voter } = models;
var { sendRes,sendError } = require('../controllers/res')
var { Op } = require('sequelize')
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

router.get('/checkIfQualify', async (req, res) => {
    try {
        let { matric,categoryId } = req.query;

        let voter = await Voter.findOne({
            where: {
                matric
            }
        })

        if (voter) {
            if (voter.accreditedAt) {
                let category = await Category.findByPk(categoryId)

                if (voter.level >= category.minLevel && voter.level <= category.maxLevel) {

                    let check = await Candidate.count({
                        where: {
                            matric,
                            [Op.or]: [{status: "confirmed"}, {status: "pending"}]
                        }
                    })

                    if (check) {
                        sendError(res, 401, "You currently have an existing candidate application")
                    }

                    else {
                        sendRes(res,{voter})
                    }
                }

                else {
                    sendError(res,401,`Your current level (${voter.level}) does not fall within the category of levels required to run for this post`)
                }
            }
            else {
                sendError(res,401,`You have to be accredited as a voter to be able to apply for candidacy`)
            }
        }
        else {
            sendError(res,404,`Student not found for this ${process.env.APP_TYPE.toLowerCase()}`)
        }
    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


//Candidate Applying For A Position
router.post('/apply', async (req, res) => {
    try {
        var { firstName,lastName,alias,manifesto,instagram,twitter,phoneNumber,imageUrl,level,matric,categoryId } = req.body;

        var category = await Category.findByPk(categoryId);

        if (category) {
            let check = await Candidate.count({
                where: {
                    matric,
                    [Op.or]: [{status: "confirmed"}, {status: "pending"}]
                }
            })

            let statusCode = nanoid(6)

            if (!check) {
                let candidate = await category.createCandidate({
                    firstName,lastName,alias,manifesto,instagram,twitter,phoneNumber,imageUrl,level,matric,
                    statusCode,
                    status: "pending"
                })

                sendRes(res,{candidate})
            }

            else {
                sendError(res,401,"You have an existing application already!")
            }
        }

        else {
            sendError(res,400,"The category selected does not exist")
        }
    } catch (error) {
        console.log(error)
        sendError(res,500)
    }
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
            sendRes(res,{candidate})
        }
        else {
            sendError(res,404)
        }

    } catch (error) {
        console.error(error)
        sendError(res, 500)
    }
})


module.exports = router;