
const express = require('express');
const mongoose = require('mongoose');
const ConnectDB  = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
ConnectDB().then(()=>{
   app.listen(8001,()=>{
     console.log("Server started on port 8001");
   })
}).catch((err)=>{
   console.error("database connection not established");
})