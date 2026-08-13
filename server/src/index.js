const express = require("express")
const main = require("./config/db")
const cookie_parser = require("cookie-parser")
const cors = require("cors")
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/userSubmission");


require("dotenv").config();
const app = express();


app.use(express.json());
app.use(cookie_parser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Frontend URLs
    credentials: true  // Cookies bhejne ke liye zaroori hai
}));
app.use("/user",authRouter);
app.use("/problem", problemRouter);
app.use("/submission",submitRouter)

// ==========================================
// HEALTH MONITOR (To prevent sleep on free hosting)
// ==========================================
app.get("/health", (req, res) => {
    res.status(200).send("Backend is awake and healthy! 🚀");
});

// Ping the server every 5 minutes
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
setInterval(async () => {
    try {
        // Agar aap .env me BACKEND_URL (jaise https://apka-app.onrender.com/health) daaloge toh usko ping karega, warna localhost ko
        const url = process.env.BACKEND_URL || `http://localhost:${process.env.PORT}/health`;
        const response = await fetch(url);
        console.log(`[Health Monitor] Ping successful - Status: ${response.status}`);
    } catch (error) {
        console.error(`[Health Monitor] Ping failed:`, error.message);
    }
}, PING_INTERVAL);

main()
    .then(async()=>{
        app.listen(process.env.PORT,()=>{
        console.log("Server is listening at PORT : " + process.env.PORT);
    })
}).catch((err) => {
    console.error("Database connection failed:", err);
});
