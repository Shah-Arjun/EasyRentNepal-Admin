const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

// if callback is not used
const {promisify} = require('util')


const isAuthenticated = async(req, res, next) => {
    const token = req.headers.authorization       //authorization token is send from frontend

    if(!token){
        return res.status(403).json({
            message: "Please login"
        })
    }

    //if token is send by frontend then verify it if legit using same secret key
    // and permit authorization
    // jwt.verify(token, process.env.SECRET_KEY, (err, success) => {
    //     if(err){
    //         res.status(400).json({
    //             message: "Invalid token"
    //         })
    //     } else {
    //         res.status(200).json({
    //             message: "Valid token"
    //         })
    //     }
    // })


    //OR



    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY)
        //console.log("promisify result: ", decoded)
        const doesUserExist = await User.findOne({_id : decoded.id})         //checks if decoded.id(i.e. userId) exists or not in user table, returns whole user data of that id

        if(!doesUserExist){
            return res.status(404).json({
                message: "User doesn't exist with that token/id"
            })
        }

        req.user = doesUserExist  //append user key in db, passes the user details to next parameter ie. restrictTo controller

        next()   // after authenticaton success, it runs next parameter ie. restrictTo controller

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

    
}

module.exports = isAuthenticated