const User = require("../models/user")
const validation = require("../utils/validator") 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Submission = require("../models/submission")

// Cookie options — production mein cross-domain (Netlify↔Render) ke liye
// sameSite: 'none' + secure: true zaroori hai
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
};

// register function
const register = async (req,res)=>{
    
    try{
        //Validate the data
        validation(req.body);
        const {firstName,emailId,password} = req.body;
        req.body.role = "user";

        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);
        const reply={
            firstName:user.firstName,
            lastName:user.lastName,
            emailId:user.emailId,
            _id:user._id    
        }

        const token = jwt.sign({role :user.role,_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie("token", token, cookieOptions);
        
        res.status(201).json({
            message:"User Registered",
            user:user
        });

    } catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

// login function
const login = async(req,res)=>{
   
    try{
        const {emailId,password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const match = await bcrypt.compare(password,user.password)
        
        if(!match)
            throw new Error("Invalid Credentials")

        const reply={
            firstName:user.firstName,
            lastName:user.lastName,
            emailId:user.emailId,
            _id:user._id
        }
        
        const token = jwt.sign({_id:user._id,emailId:user.emailId , role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie("token", token, cookieOptions);
        
        res.status(201).json({
            message:"Logged in Successfully",
            user:user
        })
        
    } catch(error){
        res.status(401).json({
            message:error.message
        })
    }
}


// logout function
const logout = async(req,res) =>{
    try{
        res.clearCookie("token", { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax' });
        res.status(200).json({
            message:"Logged out successfully"
        })
    }catch(error){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


// adminRegister function
const adminRegister=async(req,res)=>{
    try{
        //Validate the data
        validation(req.body);
        const {firstName,emailId,password} = req.body;
        req.body.role = "admin";
        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);

        const token = jwt.sign({role :user.role,_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie("token", token, cookieOptions);
        
        res.status(201).json({
            message:"User Registered",
            token
        });
        
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

const deleteProfile = async(req,res)=>{
    try{
        const userId = req.user._id;
        // userSchema se delete kar diya
        await User.findByIdAndDelete(userId);

        //submissions delete karo
        await Submission.deleteMany({userId:userId});

        // Cookie clear karo taaki deleted user ka token invalid ho jaye
        res.clearCookie("token", { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax' });
        
        res.status(200).json({
            message:"Profile deleted successfully"
        })

    } catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

const { uploadToCloudinary } = require("../config/cloudinary");

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const userId = req.user._id;

        // Check if Cloudinary keys are configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            return res.status(500).json({
                message: "Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env."
            });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer);
        const avatarUrl = uploadResult.secure_url;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Avatar uploaded successfully",
            avatarUrl,
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to upload avatar",
            error: error.message
        });
    }
};

module.exports = {register,login,logout,adminRegister,deleteProfile,uploadAvatar}