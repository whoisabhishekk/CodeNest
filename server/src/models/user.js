const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        immutable :true,
        lowercase:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    problemSolved:{ 
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref : "Problem"
        }]
    },
    password:{
        type:String,
        required:true
    },
    avatarUrl:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    country:{
        type:String,
        default:"India"
    }
} , {timestamps:true} );


const User = mongoose.model("User",userSchema);
module.exports = User;

