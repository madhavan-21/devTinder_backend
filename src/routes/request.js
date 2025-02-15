const express = require('express');
const requestRouter = express.Router();

const userAuth = require("../middleware/auth");
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');


requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
       try{
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus =["ignored","interested"]

            if (!allowedStatus.includes(status)){
                return res.status(400).json({message: "Invalid status"})
            }

            const toUser = await user.findById(toUserId);
            if(!toUser){
                return res.status(400).json({message: "User not found"})
            }
            console.log(toUser)
            console.log(fromUserId)
            const connectionRequestExist = await ConnectionRequest.findOne({
                $or:[
                    {fromUserId: fromUserId, toUserId: toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId},
                ]});

            if(connectionRequestExist){
                return res.status(400).json({message: "Request already sent"})
            }
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            })
            const data = await connectionRequest.save();
            res.status(201).json({message: "Request sent successfully", data})
       }catch(err){
        console.error(err.message)
        res.status(400).send("Error : "+ err)
       }
})



requestRouter.post("/request/review/:status/:requestId",userAuth,async(req, res)=>{
     try{
        const loggedInUser = req.user._id;
        const{status , requestId} = req.params;
        const allowedStatus =["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status"})
        }    
        const connectionRequest = await ConnectionRequest.findOne(
            {_id: requestId,
            toUserId: loggedInUser
            }
        );
        if (!connectionRequest){
            return res.status(400).json({message: "Request not found"})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(201).json({message: "Request reviewed successfully", data})
     }catch(err){

     }
})


module.exports = requestRouter;