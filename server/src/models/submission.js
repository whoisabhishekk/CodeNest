const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    problemId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Problem",
        required : true
    },
    language : {
        type : String,
        required : true,
        enum: ["c++", "javascript", "java"]
    },
    code : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "wrong", "error"],
        default : "pending"
    },
    runtime : {
        type : Number,
        default:0
    },
    errorMessage : {
        type : String,
        default:""
    },
    testCasesPassed : {
        type : Number,
        default:0
    },
    totalTestCases : {
        type : Number,
        default:0
    },
    memory : {
        type : Number,
        default:0
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})

submissionSchema.index({userId:1,problemId:1}); 

module.exports = mongoose.model("Submission",submissionSchema)