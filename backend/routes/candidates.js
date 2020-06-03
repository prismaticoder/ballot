var express = require('express');
var router = express.Router();
var models = require('../models'); // loads index.js
var { Candidate,Category,Voter } = models;
var { sendRes,sendError } = require('../controllers/res')
var { checkState,onlyPreVoting,onlyVoting,onlyPostVoting } = require('../controllers/middleware')
var { Op } = require('sequelize')
var cloudinary = require('cloudinary').v2;

//Display all *confirmed* candidates of a particular region
router.get('/', async (req, res) => {

    try {
        
        let categories = await Category.findAll({
            include: {
                model: Candidate,
                required: false,
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
                        sendError(res, 403, "You currently have an existing candidate application")
                    }

                    else {
                        sendRes(res,{voter})
                    }
                }

                else {
                    sendError(res,403,`Your current level (${voter.level}) does not fall within the category of levels required to run for this post`)
                }
            }
            else {
                sendError(res,403,`You have to be accredited as a voter to be able to apply for candidacy`)
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
router.post('/apply', onlyPreVoting, async (req, res) => {
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

            let firstString = Math.floor(1000 + Math.random() * 9000);
            let firstAlphabet = String.fromCharCode(65+Math.floor(Math.random() * 26));
            let secondAlphabet = String.fromCharCode(65+Math.floor(Math.random() * 26));

            let statusCode = `${firstString}${firstAlphabet}${secondAlphabet}`

            if (!check) {
                let candidate = await category.createCandidate({
                    firstName,lastName,alias,manifesto,instagram,twitter,phoneNumber,imageUrl,level,matric,
                    statusCode,
                    status: "pending"
                })

                sendRes(res,{candidate},201)
            }

            else {
                sendError(res,403,"You have an existing application already!")
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
router.get('/checkStatus', async (req, res) => {
    
    if (req.query.statusCode && req.query.matric) {
        let { statusCode,matric } = req.query

        try {
         
            let candidate = await Candidate.findOne({
                where: {
                    matric
                },
                include: {
                    attributes: ['name'],
                    model: Category,
                    as: "category"
                }
            })
    
            if (!candidate) {
                sendError(res,404,"Candidate not found")
            }

            else {
                if (candidate.statusCode == statusCode) {
                    sendRes(res,{candidate})
                }

                else {
                    sendError(res,404,"Incorrect status code")
                }
            }
            
        } catch (error) {
            sendError(res,500)
        }
    }
    else {
        sendError(res,400)
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

router.delete('/:id', async (req, res) => {
    let { id } = req.params;

    let { statusCode } = req.query;

    if (statusCode) {

        try {
         
            let candidate = await Candidate.findOne({
                where: {
                    id
                }
            })
    
            if (candidate) {

                if (candidate.statusCode == statusCode) {

                    if (candidate.status == "pending") {
                        await candidate.destroy();
                        sendRes(res,{message: "Your application has been cancelled successfully"})
                    }

                    else {
                        sendError(res,403,"Sorry, only candidates who are on a pending status can make a request to cancel an application")
                    }
                    
                }
    
                else {
                    sendError(res,403,"You are unauthorized to make this request")
                }
            }
    
            else {
                sendError(res,404,"Candidate not found")
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

router.put('/:id', async (req, res) => {
    let {id} = req.params
    let {alias, phoneNumber, twitter, manifesto, instagram} = req.body;


    try {
        
        let candidate = await Candidate.findByPk(id);


        if (candidate) {
            if (candidate.status != "pending") {
                sendError(res,403,"Details can only be updated for candidates with a pending status")
            }

            else {
                candidate.alias = alias;
                candidate.phoneNumber = phoneNumber;
                candidate.manifesto = manifesto;
                candidate.twitter = twitter;
                candidate.instagram = instagram;

                await candidate.save()

                sendRes(res,{message: "Details updated successfully"})
            }
        }

        else {
            sendError(res,404,"Candidate not found!")
        }

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


module.exports = router;