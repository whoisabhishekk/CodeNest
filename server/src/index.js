const express = require("express")
const main = require("./config/db")
const cookie_parser = require("cookie-parser")
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/userSubmission");


require("dotenv").config();
const app = express();


app.use(express.json());
app.use(cookie_parser());
app.use("/user",authRouter);
app.use("/problem", problemRouter);
app.use("/submission",submitRouter)

main()
    .then(async()=>{
        app.listen(process.env.PORT,()=>{
        console.log("Server is listening at PORT : " + process.env.PORT);
    })
}).catch((err) => {
    console.error("Database connection failed:", err);
});
