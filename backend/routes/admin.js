var express = require('express');
var router = express.Router();

var models = require('../models'); // loads index.js
var { Category,Region,Candidate,Voter } = models;       // the model keyed by its name

var { Op } = require('sequelize')

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
    let { region } = res.locals;
    let { type } = region;
    let perPage = (req.query.perPage)?req.query.perPage:15
    let page = (req.query.page)?req.query.page:1

    try {
        let voters = [];
        if (type == 'faculty') {
            voters = await Voter.findAll({
                where: {
                    faculty: region.name
                }
            })
        }
        else if (type == 'department') {
            voters = await Voter.findAll({
                where: {
                    department: region.name
                }
            })
        }
        else {
            voters = await Voter.findAll({
                where: {
                    hall: region.name
                }
            })
        }

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

        // return res.render('all-voters',{
        //     region,
        //     voters,
        //     title: `${region.name} Voters`,
        //     page_name: `voters`
        // })

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

        console.log(page,perPage,count)

        return res.json({ok:true, region, totalPages, nextPage, currentPage:page, voters})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error Understanding Request", error})
    }
})

//Search for a voter by matric
router.get('/voters/search', async (req, res) => {
    let { region } = res.locals;
    let { q } = req.query;
    let { type } = region;

    if (q) {
        let voter = [];
        try {
            if (type == 'faculty') {
                voter = await Voter.findOne({
                    where: {
                        faculty: region.name,
                        matric:q
                    }
                })
            }
            else if (type == 'department') {
                voter = await Voter.findOne({
                    where: {
                        department: region.name,
                        matric: q
                    }
                })
            }
            else {
               voter = await Voter.findOne({
                    where: {
                        hall: region.name,
                        matric: q
                    }
                })
            }
            if (voter !== null) {
                return res.status(200).json({ok: true, voter})
            }
    
            return res.status(200).json({ok: false, message: "Voter not found"})
                   
        } catch (error) {
            return res.status(400).json({ok: false, message: "There is an error in your request"})
        }
    }
    else {
        return res.status(400).json({ok: false, message: "Bad Request"});
    }
})

//View all candidates
router.get('/candidates', async (req, res) => {
    let { region } = res.locals;
    let { status } = req.query;
    var select = {}

    try {
        if (status) {
            if (["pending","confirmed"].includes(status)) {
                (status == "pending")?select.a='selected':select.b='selected';
                var candidates = await region.getCandidates({
                    where: {
                        status
                    }
                })
            }
            else {
                throw new Error("Wrong Status")
            }
            
        }
        else {
            var candidates = await region.getCandidates({
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

        return res.json({ok:true, candidates})
        // return res.render('admin-candidates', {
        //     candidates,
        //     categories,
        //     select,
        //     page_name: "candidates",
        //     title: "Candidates"
        // })

        // return res.render('admin-candidates', {
        //     candidates,
        //     page_name: 'candidates',
        //     title: `${region.name} Candidates`
        // })
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error: Bad Request", error})
    }
    
    // res.send("List of all candidates!")
})

//View single candidates
router.get('/candidates/:id', (req, res) => {
    res.send("Details of a single candidate")
})

//Create Election Settings for a region
router.post('/settings/create', async (req, res) => {
    let { region } = res.locals;

    try {
        let { startDate,endDate } = req.body;

        let settings = await region.createSetting({
            startDate,
            endDate
        })
        
        return res.status(201).json({ok: true, message: "Settings Created Successfully",settings})
    } catch (error) {
        return res.status(400).json({ok:false, message: "Error in resolving request"})
    }
})

//Update settings for a region
router.post('/settings/update', async (req, res) => {
    let { region } = res.locals;

    try {
        let { startDate,endDate } = req.body;

        let setting = await region.getSetting()

        if (setting !== null) {
            setting.startDate = startDate;
            setting.endDate = endDate;

            await setting.save();
            
            return res.status(200).json({ok: true, message: "Settings Updated Successfully",setting})
        }

        return res.status(404).json({ok: false, message: "Settings Not Found for this region"})

        
    } catch (error) {
        return res.status(400).json({ok:false, message: "Error in resolving request", error})
    }
})

//Delete the settings of a region
router.get('/settings/delete', async (req, res) => {
    let { region } = res.locals;

    try {
        let setting = await region.getSetting();

        await setting.destroy()

        return res.json({ok: true, message: "Setting Cleared Successfully"})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error in deleting setting"}, error)
    }
})

//Get the configured settings for a particular region
router.get('/settings', async (req, res) => {
    let { region } = res.locals;

    try {
        let setting = await region.getSetting();

        if (setting !== null) {
            return res.json({ok: true, setting})    
        }
        // return res.json({ok: false, setting, message: "No settings configured for the selected region"})
        return res.render('admin-settings', {
            title: "Admin Settings",
            page_name: "settings"
        })
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error in request", error})
    }
})

//Confirm a candidate
router.post('/candidates/:id/confirm', async (req, res) => {
    let { region } = res.locals;

    try {
        //Array destructuring to retrieve the candidate
        var [ candidate ] = await region.getCandidates({
            where: {
                id: req.params.id
            }
        })
        
        // console.log(candidate);

        if (candidate !== null) {
            //Check if the candidate was already confirmed
            if (candidate.status !== "confirmed") {
                candidate.status = "confirmed";

                await candidate.save();
                return res.status(200).json({ok: true, message: `You have successfully confirmed ${candidate.firstName} ${candidate.lastName} as a candidate in the upcoming regional elections`})
            }

            return res.status(200).json({ok: true, message: "This candidate has already been confirmed"})
            
        }

        return res.status(404).json({ok: false, message: `This candidate does not exist!`})
        
    } catch (error) {
        return res.status(400).json({ok: false, message: "There was an error processing your request"})        
    }
})


//Confirm a candidate
router.post('/candidates/:id/deny', async (req, res) => {
    let { region } = res.locals;

    try {
        //Array destructuring to retrieve the candidate
        var [ candidate ] = await region.getCandidates({
            where: {
                id: req.params.id
            }
        })
        
        // console.log(candidate);

        if (candidate !== null) {
            //Check if the candidate was already confirmed
            if (candidate.status !== "denied") {
                candidate.status = "denied";

                await candidate.save();
                return res.status(200).json({ok: true, message: `${candidate.firstName} ${candidate.lastName} has been denied from participating as a candidate in the upcoming regional elections`})
            }

            return res.status(200).json({ok: true, message: "This candidate has already been denied participation in the election"})
            
        }

        return res.status(404).json({ok: false, message: `This candidate does not exist!`})
        
    } catch (error) {
        return res.status(400).json({ok: false, message: "There was an error processing your request"})        
    }
})

//Get all categories (position) associated with a region
router.get('/categories', async (req, res) => {
    let { region } = res.locals;

    try {
        let categories = await region.getCategories();

        return res.status(200).json({ok: true, categories})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Bad Request"})
    }
})

//Create a new category
router.post('/categories/create', async (req, res) => {
    let { region } = res.locals;

    try {
        let { name } = req.body

        let category = await region.createCategory({
            name
        })

        return res.status(201).json({ok: true, message: `New Category Created: ${name}`})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error Processing request", error})
    }
})

//Update an existing category
router.post('/categories/:id/update', async (req, res) => {
    let { region } = res.locals;

    try {
        let { name } = req.body

        let [ category ] = await region.getCategories({
            where: {
                id: req.params.id
            }
        })

        category.name = name;

        await category.save();

        return res.status(200).json({ok: true, message: `Category Update Successful`})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error Processing request", error})
    }
})

//Start an election manually
router.get('/election/start', async (req,res) => {
    let { region } = res.locals;

    try {
        let setting = await region.getSetting();

        setting.isStarted = 1
        await setting.save()

        return res.json({ok:true, message: "Election Started Successfully"})

    } catch (error) {
        return res.status(400).json({ok: false, message: "There was an error with your request", error})
    }
})

//Start an election manually
router.get('/election/stop', async (req,res) => {
    let { region } = res.locals;

    try {
        let setting = await region.getSetting();

        setting.isStarted = 0
        await setting.save()

        return res.json({ok:true, message: "Election Stopped Successfully"})

    } catch (error) {
        return res.status(400).json({ok: false, message: "There was an error with your request", error})
    }
})

//Delete a category
router.get('/categories/:id/delete', async (req, res) => {
    let { region } = res.locals;

    try {
        //Get the category from the db
        let [ category ] = await region.getCategories({
            where: {
                id: req.params.id
            }
        })
        //Delete the category
        await category.destroy();

        return res.status(200).json({ok: true, message: `Category Deleted Successfully`})
    } catch (error) {
        return res.status(400).json({ok: false, message: "Error Processing request", error})
    }
})

router.get('/logout', async (req, res) => {
    let { region } = res.locals;
    delete req.session.admin;
    return res.redirect(`/${region.slug}/admin/login`)
})





module.exports = router;