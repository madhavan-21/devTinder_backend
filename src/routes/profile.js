const express = require('express')
const profileRouter = express.Router();
const{validateEditProfileData}=require('../utils/validation');

const userAuth = require('../middleware/auth');


profileRouter.get("/profile",userAuth,async(req, res)=>{
    try{
        const user = req.user;
        res.status(200).json({message : "user profile", data : user})
    }catch(err){
        console.error(err.message)
        res.status(400).send("Error : "+ err)
    }
})


profileRouter.get("/profile/edit",userAuth,async(req, res)=>{
    try{
        validateEdit = validateEditProfileData(req)
        if(validateEdit == false){
            console.log(validateEdit)
            return res.status(400).json({message: "Invalid Edit data"})
        }

        const loggedInUser = req.user;
        console.log(loggedInUser)
        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key] = req.body[key];
        })
        console.log(loggedInUser)
        await loggedInUser.save();

        res.status(200).json({message : `${loggedInUser.firstName} ${loggedInUser.lastName} user profile edited`, data : loggedInUser})
    }catch(err){
          console.error(err.message)
          res.status(400).send("Error : "+ err)
    }
})
module.exports = profileRouter;