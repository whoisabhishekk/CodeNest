const express = require("express");
const {createProblem,updateProblem,deleteProblem, getProblemByID, getAllProblem, problemSolvedByUser,submittedProblem} = require("../controllers/userProblem");

const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
    
const problemRouter = express.Router();

// for admin
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

// for user
problemRouter.get("/problemById/:id",userMiddleware,getProblemByID);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,problemSolvedByUser);  
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

module.exports = problemRouter;     