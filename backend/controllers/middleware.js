var { Op } = require('sequelize');
var models = require('../models'); // loads index.js
var { Category,Region } = models; 
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

exports.validateAdminToken = async (req, res, next) => {

    try {

        if (req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1]
            let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    
            let { username } = decodedToken
            if (req.body.username && req.body.username !== username) {
                sendError(res,401)
            }
        
            else {
                next()
            }
        }
        else {
            sendError(res,400,"Invalid Request: No Token sent")
        }

    } catch (error) {
        console.error(error);
        sendError(res,500,error)
    }

}