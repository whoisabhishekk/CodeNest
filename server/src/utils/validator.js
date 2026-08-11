const validator = require("validator")


const validation = (data)=>{
    
    const mandatoryField = ["firstName","lastName","password","emailId"]

    const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!isAllowed){
        throw new Error("Field Missing");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid Email")
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("Password too weak")
    }
    if(!validator.isAlpha(data.firstName)){
        throw new Error("firstName should be alphabetic")
    }
    if(!validator.isAlpha(data.lastName)){
        throw new Error("lastName should be alphabetic")
    }
    if(data.age !== undefined){
        if(typeof data.age !== "number" || data.age<18 || data.age>80){
            throw new Error("age should be a number between 18 and 80")
        }
    }

}


module.exports = validation;