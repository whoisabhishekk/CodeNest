// One-time script to promote a user to admin
// Usage: node src/makeAdmin.js <email>

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

const email = process.argv[2];

if (!email) {
    console.log("Usage: node src/makeAdmin.js <your-email>");
    console.log("Example: node src/makeAdmin.js abhishek@gmail.com");
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("Connected to MongoDB");

        const user = await User.findOne({ emailId: email.toLowerCase() });
        if (!user) {
            console.log(`❌ No user found with email: ${email}`);
            // List all users
            const allUsers = await User.find({}, 'firstName emailId role');
            console.log("\nExisting users:");
            allUsers.forEach(u => console.log(`  - ${u.emailId} (${u.role})`));
            process.exit(1);
        }

        user.role = "admin";
        await user.save({ validateModifiedOnly: true });
        console.log(`✅ ${user.firstName} (${user.emailId}) is now an admin!`);
        console.log("\n👉 Re-login on the website to see the Admin link in the navbar.");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

run();
