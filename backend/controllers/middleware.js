var { Op } = require('sequelize');
var models = require('../models'); // loads index.js
var { Category,Region, Setting, Vote} = models; 
var { sendError } = require('./res')
var jwt = require('jsonwebtoken');

exports.checkRegion = async (req, res, next) => {
    let { region } = req.params

    let check = await Region.findOne({
        where: {
            slug: region
        }
    })

    if (check == null) {
        return res.status(404).json({"ok":false, "error":"Region Not Found"})
    }

    res.locals.flash = req.session.flash
    delete req.session.flash
    res.locals.region = check;
    next();
}

exports.checkAdminState = async (req, res, next) => {
    let { region } = req.params
    let check = await Region.findOne({
        where: {
            slug: region
        }
    })

    if (req.session.admin && req.session.admin == check.slug) {
        return next();
    }

    else {
        //If the user is not logged in, send a flash message to the user
        req.session.flash = {
        type: 'error',            
        intro: 'Error',            
        message: 'You have to be logged in to view this page'
        }; 
        res.redirect(`/${region}/admin/login`)
        // next(err);  //Error, trying to access unauthorized page!
    }
}

exports.checkState = async (req, res, next) => {
    try {

        let [ config ] = await Setting.findAll();

        if (config) {

            var currentTime = new Date()
            , hasStarted = currentTime >= config.startDate
            , hasEnded = currentTime >= config.endDate
            , state = null;
      
            if (!hasStarted && !hasEnded) {
              state = "prevoting"
            }
      
            else if (hasStarted && !hasEnded) {
              state = "voting";
            }
      
            else {
              state = "postvoting"
            }
          }
      
          else {
            state = "prevoting"
          }
      
          res.locals.state = state;
          next();
        
    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
}

exports.onlyPreVoting = async (req, res, next) => {
    try {
        

        let [ config ] = await Setting.findAll();

        if (config) {

            var currentTime = new Date()
            , hasStarted = currentTime >= config.startDate
            , hasEnded = currentTime >= config.endDate
            , state = null;
      
            if (!hasStarted && !hasEnded) {
                res.locals.state = "prevoting"
                res.locals.startDate = config.startDate
                res.locals.endDate = config.endDate
                next()
            }

            else {
                sendError(res,403,"Error: This action can only be performed in the pre-election phase")
            }
        }

        else {
            res.locals.state = "prevoting"
            next()
        }


    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
}

exports.onlyVoting = async (req, res, next) => {
    try {
        

        let [ config ] = await Setting.findAll();

        if (config) {

            var currentTime = new Date()
            , hasStarted = currentTime >= config.startDate
            , hasEnded = currentTime >= config.endDate
      
            if (hasStarted && !hasEnded) {
                res.locals.state = "voting"
                res.locals.startDate = config.startDate
                res.locals.endDate = config.endDate
                next()
            }

            else {
                sendError(res,403,"Error: This action can only be performed when voting is ongoing")
            }
        }

        else {
            sendError(res,422,"Action cannot be performed because election parameters have not been set")
        }


    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
}

exports.onlyPostVoting = async (req, res, next) => {
    try {
        

        let [ config ] = await Setting.findAll();

        if (config) {

            var currentTime = new Date()
            , hasStarted = currentTime >= config.startDate
            , hasEnded = currentTime >= config.endDate
            , state = null;
      
            if (hasStarted && hasEnded) {
                res.locals.state = "postvoting"
                res.locals.startDate = config.startDate
                res.locals.endDate = config.endDate
                next()
            }

            else {
                sendError(res,403,"Error: This action can only be performed in the post-election phase")
            }
        }

        else {
            sendError(res,422,"Action cannot be performed because election parameters have not been set")
        }


    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
}

//Action that can only be performed outside voting
exports.exceptVoting = async (req, res, next) => {
    try {
        

        let [ config ] = await Setting.findAll();

        if (config) {

            var currentTime = new Date()
            , hasStarted = currentTime >= config.startDate
            , hasEnded = currentTime >= config.endDate
      
            if (!(hasStarted && !hasEnded)) {  
                next()
            }

            else {
                sendError(res,403,"Error: This action can not be performed when voting is ongoing")
            }
        }

        else {
            sendError(res,422,"Action cannot be performed because election parameters have not been set")
        }


    } catch (error) {
        console.error(error)
        sendError(res,500)
    }
}

exports.validateAdminToken = async (req, res, next) => {

    try {

        if (req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1]

            jwt.verify(token,process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    sendError(res,401,err)
                }
                else {
                    next()
                }
            })
        }
        else {
            sendError(res,401,"Invalid Request: No Token sent")
        }

    } catch (error) {
        console.error(error);
        sendError(res,500,error)
    }

}

exports.validateVoterToken = async (req, res, next) => {
    try {
        
        if (req.headers["x-auth-user"]) {
            let token = req.headers["x-auth-user"].split(' ')[1]

            jwt.verify(token,process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    sendError(res,401,err)
                }
                else {
                    res.locals.voterCode = decoded.voterCode
                    res.locals.voterId = decoded.voterId
                    next()
                }
            })
        }
        else {
            sendError(res,401,"Invalid Request: No Token sent")
        }

    } catch (error) {
        console.error(error);
        sendError(res,500,error)
    }
}


// exports.checkIfVoted = async (req, res, next) => {

//     try {
        
//         let 
//         let [ setting ] = await Setting.findAll()
//         let { startDate, endDate } = setting
    
//         let vote = await Vote.findOne({
//             where: {
//                 voterId,
//                 updatedAt: {
//                     [Op.gte] : startDate,
//                     [Op.lte] : endDate
//                 }
//             }
//         })

//         if (!vote) {
//             next()
//         }
//         else {
//             return sendError(res,403,"You have already voted in this election")
//         }

//     } catch (error) {
//         console.error(error)
//         sendError(res,500)
//     }

// }