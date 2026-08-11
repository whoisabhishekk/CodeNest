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



module.exports = authRouter;
