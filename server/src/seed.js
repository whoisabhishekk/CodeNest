const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/problem');
const User = require('./models/user');
const seedData = require('./seedData');

const seedDB = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("Connected to MongoDB");

        // 1. Find or create an admin user to be the problem creator
        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            console.log("No admin user found. Creating a default admin user...");
            adminUser = await User.create({
                firstName: "CodeNest",
                lastName: "Admin",
                emailId: "admin@codenest.com",
                password: "adminpassword123", // In a real scenario, this should be hashed
                role: "admin",
                age: 25
            });
        }
        console.log(`Using Admin User: ${adminUser.emailId} (ID: ${adminUser._id})`);

        // 2. Prepare problems with the creator ID
        const problemsToInsert = seedData.map(prob => ({
            ...prob,
            problemCreator: adminUser._id
        }));

        // 3. Clear existing problems (Optional - comment out if you want to keep old ones)
        // await Problem.deleteMany({});
        // console.log("Cleared existing problems");

        // 4. Insert new problems
        console.log(`Inserting ${problemsToInsert.length} problems...`);
        const inserted = await Problem.insertMany(problemsToInsert);
        console.log(`Successfully inserted ${inserted.length} problems!`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
