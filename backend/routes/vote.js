var express = require('express');
var router = express.Router();
var models = require('../models');
var Config = models.Setting;
var { Admin,Category,Candidate,Voter,Vote } = models
var { Op } = require('sequelize');
var { sendRes,sendError } = require('../controllers/res')


router.get('/categories', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        let { votes } = req.body;
        votes = JSON.parse(votes)

        let { voterCode, voterId } = res.locals
        votes = votes.map(vote => {
            return {voterId, ...vote}
        })

        votes = votes.filter(vote => vote.candidateId !== null)
        
        let [ setting ] = await Config.findAll()
        let { startDate, endDate } = setting

        if (voterId && voterCode) {
            //first check if the person has voted in this election
            let vote = await Vote.findOne({
                where: {
                    voterId,
                    updatedAt: {
                        [Op.gte] : startDate,
                        [Op.lte] : endDate
                    }
                }
            })

            if (vote) {
                return sendError(res,403,"You have already voted in this election")
            }

            else {
                let insert = await Vote.bulkCreate(votes)

                if (insert) {
                    sendRes(res,{message: "You have successfully cast your vote in this election. Do check back when the election is over for the election results :)"},201)
                }
                else {
                    sendError(res,422,"Sorry, there was an error processing your request")
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

module.exports = router