const express = require("express")
const {register,login,logout,adminRegister,deleteProfile} = require("../controllers/userAuthenticate")
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
authRouter.post("/deleteProfile",userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply={
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        emailId:req.user.emailId,
        _id:req.user._id,
        role:req.user.role
    }
    res.status(200).json({
        message:"ok",
        user:reply
    })
})



module.exports = authRouter;
