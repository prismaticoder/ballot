var express = require('express');
var router = express.Router();
var models = require('../models');
var Config = models.Setting;
var { Admin,Category,Candidate,Voter } = models
var { sendRes,sendError } = require('../controllers/res')


router.post('/:candidateId', async (req, res) => {
    try {
        let { candidateId } = req.params;
        let { crossCode, id } = req.body;
        let voterCode = res.locals.voterCode

        if (candidateId && crossCode && voterCode) {
            let candidate = await Candidate.findOne({
                where: {
                    id: candidateId,
                    status: "confirmed"
                },
                include: {
                    attributes: ['id','name'],
                    model: Category,
                    as: "category"
                }
            });

            if (candidate) {
                if (candidate.statusCode == crossCode) {
                    let voter = await Voter.findByPk(id)

                    if (voter && voter.voterCode == voterCode) {
                        let check = await voter.getVotes({
                            where: {
                                categoryId: candidate.category.id
                            }
                        })

                        if (check.length > 0) {
                            sendError(res,422,"You have already voted for a candidate for this category")
                        }

                        else {
                            let type = process.env.APP_TYPE.toLowerCase()

                            let facDept = (type == 'hall') ? voter.faculty : voter.department

                            await voter.createVote({
                                candidateId,
                                categoryId: candidate.category.id,
                                level: voter.level,
                                facDept
                            })

                            sendRes(res,{message: "Vote cast successfully"})
                        }
                    }

                    else {
                        sendError(res,422,"Voter not found")
                    }
                }

                else {
                    sendError(res, 422, "Candidate not found")
                }


            }
            else {
                sendError(res,403,"Candidate not found")
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