require("dotenv").config()
const jwt = require("jsonwebtoken")

const signToken = (payload) =>{
    return jwt.sign(payload,process.env.JWT_SECRET)
}

const verifyToken =(token) =>{
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    signToken,
    verifyToken
}