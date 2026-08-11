const axios = require("axios");
const Problem = require("../models/problem");
const { getLanguageVersion } = require("../utils/problemUtility");
const Submission = require("../models/submission");


// For creating new problem and excuting through jdoodle
const createProblem = async (req, res) => {
    const {
        title, 
        description, 
        difficulty, 
        tags, 
        visibleTestCases, 
        hiddenTestCases, 
        startCode, 
        referenceSolution
    } = req.body; 

    const problemCreator = req.user._id; 

    try {
   
        for (const { language, completeCode } of referenceSolution) {
            
            const langConfig = getLanguageVersion(language);
            if (!langConfig) throw new Error(`Language '${language}' not supported`);

           
            const executionPromises = visibleTestCases.map(async ({ input, output }) => {
                
                const jdoodlePayload = {
                    script: completeCode,
                    language: langConfig.language,  
                    versionIndex: langConfig.versionIndex,    
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                    stdin: input
                };
                
                const response = await axios.post(process.env.JDOODLE_API_URL, jdoodlePayload);
                const actualOutput = response.data.output ? response.data.output.trim() : "";
                const expectedOutput = output.trim();

                // If JDoodle returned an error code or actual output does not match
                if (response.data.error || actualOutput !== expectedOutput) {
                    return { 
                        passed: false, 
                        errorType: response.data.error ? "Execution Error" : "Wrong Answer", 
                        expected: expectedOutput, 
                        actual: actualOutput,
                        details: response.data.error || null
                    };
                }

              
                return { passed: true };
            });
            
            
            const results = await Promise.all(executionPromises);
            
            
            const failedTest = results.find((res) => res.passed === false);

            if (failedTest) {
                return res.status(400).json({ 
                    message: `Reference solution for ${language} is wrong.`,
                    reason: failedTest.errorType,
                    details: failedTest.details || `Expected: ${failedTest.expected}, but got: ${failedTest.actual}`
                });
            }
        }


        const newProblem = await Problem.create({
            title, 
            description, 
            difficulty, 
            tags, 
            visibleTestCases, 
            hiddenTestCases, 
            startCode, 
            problemCreator, 
            referenceSolution 
        });


        return res.status(201).json({ 
            message: "Problem successfully created and verified with Jdoodle API!",
            problem: newProblem
        });

    } catch (err) {
       
        res.status(500).json({ 
            message: "Internal Server Error while creating problem",
            error: err.message 
        });  
    }
}


// For updating a problem
const updateProblem = async (req, res) => {
    const {id} = req.params;
    const {
        title, 
        description, 
        difficulty, 
        tags, 
        visibleTestCases, 
        hiddenTestCases, 
        startCode, 
        referenceSolution
    } = req.body; 

    try {

        if(!id)
        {
            return res.status(400).json({message:"Problem ID is required for update"});
        }
        // check if problem is present
        const dsaProblem = await Problem.findById(id);
        if(!dsaProblem){
            return res.status(404).send("ID is not present")
        }
        
        for (const { language, completeCode } of referenceSolution) {
            
            const langConfig = getLanguageVersion(language);
            if (!langConfig) throw new Error(`Language '${language}' not supported`);

           
            const executionPromises = visibleTestCases.map(async ({ input, output }) => {
                
                const jdoodlePayload = {
                    script: completeCode,
                    language: langConfig.language,  
                    versionIndex: langConfig.versionIndex,    
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                    stdin: input
                };
                
                const response = await axios.post(process.env.JDOODLE_API_URL, jdoodlePayload);
                const actualOutput = response.data.output ? response.data.output.trim() : "";
                const expectedOutput = output.trim();

                // If JDoodle returned an error code or actual output does not match
                if (response.data.error || actualOutput !== expectedOutput) {
                    return { 
                        passed: false, 
                        errorType: response.data.error ? "Execution Error" : "Wrong Answer", 
                        expected: expectedOutput, 
                        actual: actualOutput,
                        details: response.data.error || null
                    };
                }

              
                return { passed: true };
            });
            
            
            const results = await Promise.all(executionPromises);
            
            
            const failedTest = results.find((res) => res.passed === false);

            if (failedTest) {
                return res.status(400).json({ 
                    message: `Reference solution for ${language} is wrong.`,
                    reason: failedTest.errorType,
                    details: failedTest.details || `Expected: ${failedTest.expected}, but got: ${failedTest.actual}`
                });
            }
        }
        const newProblem = await Problem.findByIdAndUpdate(id,{
            title, 
            description, 
            difficulty, 
            tags, 
            visibleTestCases, 
            hiddenTestCases, 
            startCode, 
            referenceSolution 
        },{runValidators:true , new:true});
        
        if(!newProblem){
            return res.status(404).send("ID is not present")
        }

        return res.status(200).json({
            message:"Problem updated successfully",
            problem: newProblem
        })

    } catch (error) {
        res.status(500).json({message:"Internal Server Error while updating problem",error:error.message})
    }
}

// for deleting a problem
const deleteProblem = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(400).json({message:"Problem ID is required for delete"});
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(404).send("ID is not present")
        }

        // Problem se judi saari submissions bhi delete karo (orphan data cleanup)
        await Submission.deleteMany({problemId: id});

        return res.status(200).json({
            message:"Problem deleted successfully",
            problem: deletedProblem
        })
    } catch (error) {
        res.status(500).json({message:"Internal Server Error while deleting problem",error:error.message})
    }
}

// for fetching a problem by ID
const getProblemByID = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(400).json({message:"Problem ID is required for fetching"});
        }
        const dsaProblem = await Problem.findById(id).select("_id title description difficulty tags visibleTestCases startCode");
        if(!dsaProblem){
            return res.status(404).send("ID is not present")
        }
        return res.status(200).json({
            message:"Problem fetched successfully",
            problem: dsaProblem
        })
    } catch (error) {
        res.status(500).json({message:"Internal Server Error while fetching problem",error:error.message})
    }
}

// for fetching all problem
const getAllProblem = async (req, res) => {
    try {
        const dsaProblem = await Problem.find().select("_id title description difficulty tags");
        if(!dsaProblem){
            return res.status(404).send("ID is not present")
        }   
        return res.status(200).json({
            message:"Problem fetched successfully",
            problem: dsaProblem
        })
    } catch (error) {
        res.status(500).json({message:"Internal Server Error while fetching problem",error:error.message})
    }
}


// for fetching all problem solved by user

const problemSolvedByUser = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        // Normal populate
        await req.user.populate({
            path: 'problemSolved',
            options: {
                skip: skip,
                limit: limit
            }
        });

        return res.status(200).json({
            message: "Problems fetched successfully",
            problems: req.user.problemSolved,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({message:"Internal Server Error while fetching problem", error: error.message});
    }
}

const submittedProblem = async(req,res) =>{
    try{
        const userId = req.user._id;
        const problemId = req.params.pid;

        const ans = await Submission.find({userId,problemId}).populate("problemId","title difficulty")
        if(ans.length == 0)
            return res.status(200).json({
                message:"No submissions found",
                ans
            }); 
        return res.status(200).json({
            message:"Submission fetched successfully",
            ans
        });

    } catch(error){
        res.status(500).json({message:"Internal Server Error while fetching submission",error:error.message})
    }
}
module.exports = { createProblem, updateProblem ,deleteProblem ,getProblemByID, getAllProblem,problemSolvedByUser,submittedProblem };
