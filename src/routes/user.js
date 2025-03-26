const express = require('express');
const userRouter = express.Router();


const userAuth = require("../middleware/auth");
const ConnectionRequest =  require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skils";


userRouter.get("/user/request/received",userAuth,async(req , res)=>{
    try{
        const loggedUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA);

        if (connectionRequests.length > 0){
            res.json({
                message: "Request received successfully",
                data: connectionRequests
            })
        }else{
            res.status(200).json({message: "No request received"})
        }

    }catch(err){
        console.error(err.message)
        res.status(400).send("Error: "+ err)
    }

})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedUser._id, status:"accepted"},
                {toUserId: loggedUser._id , status:"accepted"}
            ],
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        console.log(connectionRequest)

        const data = connectionRequest.map((row)=>{
            if (row.fromUserId._id.toString()===loggedUser._id){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message: "frd list",
           connectionlist : data   
        })
    }catch(err){
            console.error(err.message)
            res.status(400).send("Error: "+ err)
    }
})

module.exports = userRouter