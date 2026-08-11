const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userMiddleware = async(req,res,next)=>{

    try{
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not present");
        
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);
        const {_id} = decodedToken;
        if(!_id){
            throw new Error("Invalid Token");
        }
        const result = await User.findById(_id);
        if(!result){
            throw new Error("User not found");
        }
        req.user = result;
        next();
    }
    catch(err){
        res.status(401).json({
            message:err.message
        })
    }
}

module.exports = userMiddleware;