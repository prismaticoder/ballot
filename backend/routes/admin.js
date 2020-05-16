var express = require('express');
var router = express.Router();
var models = require('../models');
var { Category,Candidate,Voter } = models;
var { Op } = require('sequelize');
var { sendError, sendRes } = require('../controllers/res')

//Login middleware needed to access the site
//JWT must verify all these routes before access

router.get('/', (req,res) => {
    res.render('admin-index', {
        page_name: "home",
        title: "Home"
    })
})

//Admin Viewing all voters
router.get('/voters', async (req, res) => {

    let { type } = req.app.locals;
    let perPage = (req.query.perPage)?req.query.perPage:15
    let page = (req.query.page)?req.query.page:1

    try {

        let voters = await Voter.findAll({
            where: {
                accreditedAt: {
                    [Op.not] : null
                }
            }
        })

        voters = voters.sort((a,b) => {
            if (a.firstName < b.firstName) {
                return -1
            }
            else if (a.firstName > b.firstName) {
                return 1
            }
            else {
                return 0
            }
        })

        //Implement Pagination
        let count = voters.length;

        let totalPages = Math.ceil(count/perPage), nextPage;

        if (page !== totalPages) {
            voters = voters.slice((page * perPage) - perPage , (page * perPage));
            nextPage = page+1;
        }
        else {
            voters = voters.slice((page * perPage) - perPage);
            nextPage = null;
        }

        sendRes(res,{totalPages, nextPage, currentPage: page, voters})
        
    } catch (error) {
        console.error(error);
        sendError(res,500)
    }
})

//Search for a voter by matric
router.get('/voters/search', async (req, res) => {

    let { q } = req.query;

    if (q) {
        try {
            let voter = await Voter.findOne({
                where: {
                    accreditedAt: {
                        [Op.not] : null
                    },
                    matric:q
                }
            })
            
            if (voter) {
                sendRes(res, {voter})
            }
    
            sendError(res,404)
                   
        } catch (error) {
            console.error(error);
            sendError(res,500)
        }
    }
    else {
        sendError(res,400)
    }
})

//View all candidates
router.get('/candidates', async (req, res) => {
    
    let { status } = req.query;
    var select = {}

    try {
        if (status) {
            if (["pending","confirmed"].includes(status)) {
                (status == "pending")?select.a='selected':select.b='selected';
                var candidates = await Candidate.findAll({
                    where: {
                        status
                    }
                })
            }
            else {
                sendError(res,400)
            }
            
        }
        else {
            var candidates = await Candidate.findAll({
                where: {
                    [Op.or]: [{status: "confirmed"}, {status: "pending"}]
                }
            });
        }    

        let categories = [];

        for (let index = 0; index < candidates.length; index++) {
            let category = await candidates[index].getCategory();
            categories.push(category.name)  
        }

        sendRes(res, {candidates})

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
    
})

//View single candidates
router.get('/candidates/:id', async (req, res) => {
    let {id} = req.params;
    
    try {
        
        let candidate = await Candidate.findOne({
            where: {
                id,
                [Op.or]: [{status: "confirmed"}, {status: "pending"}]
            }
        })

        if (candidate) {
            sendRes(res,{candidate})
        }
        else {
            sendError(res,404)
        } 

    } catch (err) {
        console.error(err)
        sendError(res,500)
    }
})

//Create Election Settings for a region
router.post('/settings', async (req, res) => {

    try {
        let { startDate,endDate } = req.body;

        let settings = await Config.create({
            startDate,
            endDate
        })
        
        sendRes(res,{settings},201)
    } catch (error) {
        console.error(error);
        sendError(res,500)
    }
})

//Update settings for a region
router.put('/settings', async (req, res) => {

    try {
        let { startDate,endDate } = req.body
        , [setting] = await Config.findAll()

        if (setting) {
            setting.startDate = startDate;
            setting.endDate = endDate;

            await setting.save();
            
            sendRes(res,{setting})
        }

        sendError(res,404)

        
    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

//Get the configured settings for a particular region
router.get('/settings', async (req, res) => {

    try {
        let [setting] = await Config.findAll();

        if (setting) {
            sendRes(res,{setting})    
        }
        
        sendError(res,404)

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

//Confirm a candidate
router.get('/candidates/:id/confirm', async (req, res) => {

    try {
        //Array destructuring to retrieve the candidate
        var candidate = await Candidate.findOne({
            where: {
                id: req.params.id
            }
        })

        if (candidate) {
            //Check if the candidate was already confirmed
            if (candidate.status !== "confirmed") {
                candidate.status = "confirmed";

                await candidate.save();
                sendRes(res,{candidate})
            }
            
            sendRes(res,{candidate})
        }

        sendError(res,404)
        
    } catch (error) {
        console.error(error)
        sendError(res,500)        
    }
})


//Deny a candidate
router.get('/candidates/:id/deny', async (req, res) => {

    try {
        //Array destructuring to retrieve the candidate
        var candidate = await Candidate.findOne({
            where: {
                id: req.params.id
            }
        })
        
        // console.log(candidate);

        if (candidate) {
            //Check if the candidate was already confirmed
            if (candidate.status !== "denied") {
                candidate.status = "denied";

                await candidate.save();
                
                sendRes(res,{candidate})
            }

            sendRes(res,{candidate})
            
        }

        sendError(res,404)
        
    } catch (error) {
        console.error(error)
        sendError(res,500)        
    }
})

//Get all categories (position) associated with a region
router.get('/categories', async (req, res) => {

    try {
        let categories = await Category.findAll();

        sendRes(res,{categories})

    } catch (error) {

        console.error(error)
        sendError(res,500)
    }
})

//Create a new category
router.post('/categories', async (req, res) => {

    try {
        let { name,minLevel,maxLevel } = req.body

        let category = await Category.create({
            name,
            minLevel,
            maxLevel
        })

        sendRes(res,{category},201)

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

//Update an existing category
router.put('/categories/:id', async (req, res) => {

    try {
        let { name,minLevel,maxLevel } = req.body

        let category = await Category.findByPk(req.params.id)

        category = {...category, name, minLevel, maxLevel}

        await category.save();

        sendRes(res,{category})

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


//Delete a category
router.delete('/categories/:id', async (req, res) => {

    try {
        //Get the category from the db

        await Category.destroy(req.params.id)

        sendRes(res,{message: "Deletion Successful"})

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

router.get('/logout', async (req, res) => {
    let { region } = res.locals;
    delete req.session.admin;
    return res.redirect(`/${region.slug}/admin/login`)
})





module.exports = router;