var express = require('express');
var router = express.Router();
var { customAlphabet } = require('nanoid')
var models = require('../models');
var { Category,Candidate,Voter } = models;
var Config = models.Setting
var { Op } = require('sequelize');
var { checkState,onlyPreVoting,onlyVoting,onlyPostVoting,exceptVoting } = require('../controllers/middleware')
var { sendError, sendRes } = require('../controllers/res')

//Login middleware needed to access this section


router.get('/mainPage', async (req, res) => {
    try {
        let [ setting ] = await Config.findAll();
        let categoryCount = await Category.count();
        let pendingCount = await Candidate.count({
            where: {
                status: 'pending'
            }
        })
        let confirmedCount = await Candidate.count({
            where: {
                status: 'confirmed'
            }
        })
        let voterCount = await Voter.count();
        let accreditedVoterCount = await Voter.count({
            where: {
                accreditedAt: {
                    [Op.ne]: null
                }
            }
        })
        
        sendRes(res,{setting, categoryCount, pendingCount, confirmedCount, voterCount, accreditedVoterCount})

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


//Admin Viewing all voters
router.get('/voters', async (req, res) => {

    let { type } = req.query;
    // let perPage = (req.query.perPage)?req.query.perPage:15
    // let page = (req.query.page)?req.query.page:1

    try {

        let voters;

        if (type && type == 'accredited') {
            voters = await Voter.findAll({
                where: {
                    accreditedAt: {
                        [Op.not] : null
                    }
                }
            })
        }
        
        else {
            voters = await Voter.findAll()
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

        //Implement Pagination
        // let count = voters.length;

        // let totalPages = Math.ceil(count/perPage), nextPage;

        // if (page !== totalPages) {
        //     voters = voters.slice((page * perPage) - perPage , (page * perPage));
        //     nextPage = page+1;
        // }
        // else {
        //     voters = voters.slice((page * perPage) - perPage);
        //     nextPage = null;
        // }

        sendRes(res,{voters})
        
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
                },
                include: {
                    attributes: ['name'],
                    model: Category,
                    as: "category"
                }
            });
        }
        
        candidates = candidates.sort((a,b) => {
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

    } catch (err) {
        console.error(err)
        sendError(res,500)
    }
})

//Confirm a candidate
router.get('/candidates/:id/confirm', onlyPreVoting, async (req, res) => {

    try {
        //Array destructuring to retrieve the candidate
        var candidate = await Candidate.findOne({
            where: {
                id: req.params.id,
                status: {
                    [Op.ne] : 'denied'
                }
            }
        })

        if (candidate) {
            //Check if the candidate was already confirmed
            if (candidate.status !== "confirmed") {
                candidate.status = "confirmed";

                await candidate.save();
                return sendRes(res,{candidate},null,"Candidate approval successful!")
            }
            
            return sendError(res,422,"This candidate has already been approved")
        }

        sendError(res,404,"Candidate not found")
        
    } catch (error) {
        console.error(error)
        sendError(res,500)        
    }
})


//Deny a candidate
router.get('/candidates/:id/deny', onlyPreVoting, async (req, res) => {

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
                
                return sendRes(res,{candidate},null,"You have successfully denied this candidate's participation in the upcoming election")
            }

            return sendError(res,422,"This candidate's application has already been denied")
            
        }

        sendError(res,404,"Candidate Not Found")
        
    } catch (error) {
        console.error(error)
        sendError(res,500)        
    }
})


//Create Election Settings for a region
router.post('/settings', async (req, res) => {

    try {
        let { startDate,endDate } = req.body;

        let today = new Date()

        if (endDate > startDate) {

            if (new Date(startDate) < today) {
                sendError(res,422,"Election has to be set to a future date")
            }

            else {
                let [config] = await Config.findAll();

                if (config) {
                    //if there is already a setting
                    return sendError(res, 403, "Election configuration has already been set")
                }
                
                else {
                    let setting = await Config.create({
                        startDate,
                        endDate
                    })
                    
                    sendRes(res,{setting},201)                    
                }

            }


        }

        else {
            sendError(res,422,"Election end date must be greater than the start date")
        }

    } catch (error) {
        console.error(error);
        sendError(res,500)
    }
})

router.get('/endElection')

//Update settings for a region
router.put('/settings', exceptVoting, async (req, res) => {

    try {
        let { startDate,endDate } = req.body
        , [setting] = await Config.findAll()
        , today = new Date();

        if (endDate > startDate) {
            if (setting) {

                if (new Date(startDate) < today) {
                    sendError(res,422,"Election has to be set to a future date")
                }

                else {
                    setting.startDate = startDate;
                    setting.endDate = endDate;
        
                    await setting.save();
                    
                    return sendRes(res,{setting})
                }
            }
    
            sendError(res,404)
        }

        else {
            sendError(res,422,"Election end date must be greater than the start date")
        }

        
    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

router.patch('/settings', onlyVoting, async (req, res) => {
    try {
        let { type } = req.query

        if (type && ['end','elongate'].includes(type)) {
            let now = new Date();

            if (type == 'elongate') {
                let { newDate } = req.body;
                if (newDate) {

                    let newDateTime = new Date(newDate);

                    if (newDateTime <= now) {
                        sendError(res, 403, "You can only elongate the election to a future date")
                    }

                    else {
                        let [ setting ] = await Config.findAll()

                        if (setting) {
                            setting.endDate = newDate;
                            await setting.save()

                            sendRes(res,{setting})
                        }
                        else {
                            sendError(res,404,"There is currently no configuration for this election")
                        }
                    }


                }

                else {
                    sendError(res,400)
                }
            }

            else {
                let [ setting ] = await Config.findAll()

                if (setting) {
                    setting.endDate = now;
                    await setting.save()

                    sendRes(res,{setting},null,"Election ended successfully")
                }
                else {
                    sendError(res,404,"There is currently no configuration for this election")
                }
            }

        }

        else {
            sendError(res,400)
        }
        
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
            return sendRes(res,{setting})    
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
router.post('/categories', onlyPreVoting, async (req, res) => {

    try {
        let { name,minLevel,maxLevel } = req.body

        if (name && minLevel && maxLevel) {
            if (maxLevel >= minLevel) {

                let check = await Category.findOne({
                    where: {
                        name
                    }
                })

                if (!check) {
                    let category = await Category.create({
                        name,
                        minLevel,
                        maxLevel
                    })
            
                    sendRes(res,{category},201,"Category added successfully!")
                }

                else {
                    sendError(res,400,"A Category with this name already exists!")
                }

            }

            else {

                sendError(res,400,"Error: The minimum level must be either less than or equal to the maximum level set")

            }
        }

        else {
            sendError(res,400)
        }

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})

//Update an existing category
router.put('/categories/:id', async (req, res) => {

    try {
        let { name,minLevel,maxLevel } = req.body

        if (name && minLevel && maxLevel) {

            if (maxLevel >= minLevel) {

                //check if the category already exists
                let check = await Category.findOne({
                    where: {
                        name,
                        id : {
                            [Op.ne] : req.params.id
                        }
                    }
                })

                if (!check) {
                    let category = await Category.findByPk(req.params.id)

                    category.name = name;
                    category.minLevel = minLevel;
                    category.maxLevel = maxLevel;

                    await category.save();

                    sendRes(res,{category},null,"Category updated successfully")
                }

                else {
                    sendError(res,400,"A Category with this name already exists!")
                }
            }
            
            else {
                sendError(res,400,"Error: The minimum level must be either less than or equal to the maximum level set")
            }

        }

        else {
            sendError(res,400)
        }

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


//Delete a category
router.delete('/categories/:id', onlyPreVoting, async (req, res) => {

    try {

        //check if category exists

        let category = await Category.findByPk(req.params.id);

        if (category) {
            //Get the category from the db

            await category.destroy()

            sendRes(res,{message: "Category successfully removed"})
        }

        else {
            sendError(res,404,"Category does not exist")
        }

    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
})


router.post('/accredit', onlyPreVoting, async (req, res) => {
    try {

        let { matric, lastName, mail } = req.body;
  
        if (matric && lastName && mail) {
          let student = await Voter.findOne({
            where: {
              matric
            }
          })
      
          if (!student) {
            sendError(res,404,"Student not found")
          }
          
          else {

            if (student.lastName.toLowerCase() != lastName.toLowerCase()) {
              sendError(res,404,"Error: Credentials do not match")
            }
  
            else {
  
              if (!student.accreditedAt) {
                  //Here, we want to generate the voter code, send a mail to the personal email address of the student and also to the student email address to confirm if he/she did approve it
                  //Link sent to student mail should include a link to invalidate the code generated if not.

                  //generate the voter code
                  let nanoid = customAlphabet('123456789abcdefghjkmnpqrstuvwxyz', 6)
  
                  let voterCode = nanoid()
  
                  console.log(voterCode)
                  //This is where a mail is sent to the student and then to the email address that will be provided
                //   if (student.voterCode) {
                    //...
                    //if the student already has a voterCode, store the voter code in the payload of the confirm to be sent to his student mail so he can restore it if it was wrongly changed
                //   }

                //   else {
                    //...
                //   }
                  //await sendMail(mail)
                  //await sendMail(student.prospectiveMail)
  
                  sendRes(res,{student})
                }
  
              else {
                sendError(res,422,"This student has already confirmed accreditation and has been given a voter's number")
              }

            }
          }

        }
  
        else {
            sendError(res,422,"All fields are required")
        }
  
    } catch (error) {
      console.error(error)
      sendError(res,500)
    }
  })





module.exports = router;