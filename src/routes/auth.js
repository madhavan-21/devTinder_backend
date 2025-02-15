const express = require('express')
const authRouter = express.Router()
const {validataorSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user")


authRouter.post('/signup', async (req, res) => {
    try{
      valid = validataorSignUpData(req) 
      if (valid == true){
       const{firstName , lastName , email, password, age , gender} = req.body
       // check if user already exists
       const userExist = await User.findOne({email})
       if(userExist){
           return res.status(400).json({message: "User already exists"})
       }
       const passwordhash = await bcrypt.hash(password , 10);
       console.log(passwordhash)
       const user = new User({
        firstName,
        lastName,
        email,
        password:passwordhash,
        age,
        gender
       })
       const savedUser = await user.save()
       const token = await savedUser.getJWT();
       console.log(token)
       res.cookie("token",token,{
        expires: new Date(Date.now() + 8 * 3600000),
       })

       res.status(201).json({message: "User registered successfully", data : savedUser.toJSON()})
      }else{
        res.status(400).json({message: "Invalid data"})
       }
    }catch(err){
        console.error(err.message)
        res.status(400).send("ERROR: "+ err)
       
    }
})


authRouter.post('/login',async(req, res)=>{
    try{
        const {email ,password} = req.body;
        const userisExist = await User.findOne({email : email})
        if(!userisExist) {
           throw new Error (" user not found . need to signup or check the email address")
        }
        const isPasswordvalid = await userisExist.validatePassword(password)
        if (!isPasswordvalid) {
            res.status(400).send("password is not match");
        }else{
            const token = await userisExist.getJWT();
            console.log(token)
            res.cookie("token",token,{
                expires: new Date(Date.now() + 8 * 3600000),
            })
            res.status(200).json({message : "login successfull ", data : userisExist})
        }
    }catch(err){
        console.error(err.message)
        res.status(400).send("Error : "+ err)
    }
})

authRouter.post("/logout",(req, res)=>{
    res.clearCookie("token")
    res.status(200).json({message : "logout successfull"})
})

module.exports = authRouter