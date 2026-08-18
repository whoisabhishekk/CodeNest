const Problem = require("../models/problem");
const Submission = require("../models/submission");
const axios = require("axios");
const { getLanguageVersion } = require("../utils/problemUtility");

const submitCode = async(req,res)=>{
    try{
        const userId = req.user._id;
        const problemId = req.params.id; // FIXED: Destructuring issue

        const {code,language} = req.body;
        if(!userId || !problemId || !code || !language){
            return res.status(400).json({message:"Some field missing"});
        }
        
        // fetch the hidden test cases from problem database    
        const problem = await Problem.findById(problemId);
        if(!problem){
            return res.status(404).json({message:"Problem not found"});
        }
        const hiddenTestCases = problem.hiddenTestCases;
        
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:"pending",
            totalTestCases: hiddenTestCases.length
        });

        const languageConfig = getLanguageVersion(language);
        if (!languageConfig) {
            return res.status(400).json({message:"Unsupported language"});
        }

        let maxMemory = 0;
        let maxRuntime = 0;
        let testCasesPassed = 0;

        // har hidden test case ko execute karna hai
        for (const { input, output } of hiddenTestCases) {
            const jdoodlePayload = {
                script: code,
                language: languageConfig.language,
                versionIndex: languageConfig.versionIndex,
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                stdin: input
            };
            const response = await axios.post(process.env.JDOODLE_API_URL, jdoodlePayload);
            
            // Extract memory and runtime from JDoodle response
            if (response.data.memory) maxMemory = Math.max(maxMemory, parseFloat(response.data.memory));
            if (response.data.cpuTime) maxRuntime = Math.max(maxRuntime, parseFloat(response.data.cpuTime));

            const actualOutput = response.data.output ? response.data.output.trim() : "";
            const expectedOutput = output.trim();

            if (response.data.error || actualOutput !== expectedOutput) {
                submission.status = "wrong";
                submission.errorMessage = response.data.error ? "Execution Error" : "Wrong Answer";
                submission.memory = maxMemory;
                submission.runtime = maxRuntime;
                submission.testCasesPassed = testCasesPassed;
                await submission.save(); // FIXED: added await
                return res.status(400).json({message:"Wrong Answer"});
            }
            testCasesPassed++;
        }

        // agar sab test cases paas ho gye to accepted
        submission.status = "accepted";
        submission.memory = maxMemory;
        submission.runtime = maxRuntime;
        submission.testCasesPassed = testCasesPassed;
        await submission.save(); // FIXED: added await

        // User ke "problemSolved" array me problemId add karna (agar pehle se nahi hai)
        if(!req.user.problemSolved.includes(problemId)){
            req.user.problemSolved.push(problemId);
            await req.user.save();
        }

        return res.status(200).json({
            message:"Accepted", 
            submissionId: submission._id,
            runtime: maxRuntime,
            memory: maxMemory
        });

    } catch(err){
        res.status(500).json({message:"Internal server error",err:err.message});
    }
}

const runCode = async (req, res) => {
    try {
        const problemId = req.params.id;
        const { code, language, customInput } = req.body;
        
        if (!problemId || !code || !language) {
            return res.status(400).json({ message: "Some field missing" });
        }
        
        const languageConfig = getLanguageVersion(language);
        if (!languageConfig) {
            return res.status(400).json({ message: "Unsupported language" });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Agar custom input hai, to sirf usi pe run karo
        if (customInput !== undefined) {
            const jdoodlePayload = {
                script: code,
                language: languageConfig.language,
                versionIndex: languageConfig.versionIndex,
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                stdin: customInput
            };
            const response = await axios.post(process.env.JDOODLE_API_URL, jdoodlePayload);
            return res.status(200).json({
                message: "Executed",
                output: response.data.output,
                memory: response.data.memory,
                cpuTime: response.data.cpuTime,
                error: response.data.error
            });
        }

        // Agar custom input nahi hai, to visible test cases pe run karo
        const visibleTestCases = problem.visibleTestCases;
        const results = [];

        for (let i = 0; i < visibleTestCases.length; i++) {
            const { input, output } = visibleTestCases[i];
            const jdoodlePayload = {
                script: code,
                language: languageConfig.language,
                versionIndex: languageConfig.versionIndex,
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                stdin: input
            };
            const response = await axios.post(process.env.JDOODLE_API_URL, jdoodlePayload);
            
            const actualOutput = response.data.output ? response.data.output.trim() : "";
            const expectedOutput = output.trim();
            const passed = (!response.data.error && actualOutput === expectedOutput);

            results.push({
                testCase: i + 1,
                input: input,
                expectedOutput: expectedOutput,
                actualOutput: actualOutput,
                passed: passed,
                memory: response.data.memory,
                cpuTime: response.data.cpuTime,
                error: response.data.error
            });
        }

        return res.status(200).json({
            message: "Execution finished",
            results: results
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error", err: err.message });
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;
        const submissions = await Submission.find({ userId })
            .populate("problemId", "title difficulty tags")
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            message: "Submissions fetched successfully",
            submissions
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err: err.message });
    }
};

module.exports = { submitCode, runCode, getUserSubmissions };