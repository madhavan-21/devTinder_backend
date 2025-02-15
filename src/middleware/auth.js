const jwt = require("jsonwebtoken");
const User = require('../models/user');

const userAuth = async (req, res , next)=>{
  try{
       const{ token } = req.cookies;
       if(!token){
           return res.status(401).json({message: "not authenticated"})
       }

       const decodedObj = await jwt.verify(token, "dev@dinder");
       console.log(decodedObj)

       const{_id} = decodedObj
       const user = await User.findById(_id);
       if(!user){
           return res.status(401).json({message: "not authenticated"})
       }

       req.user = user;
       next();
    }catch(err){
      console.error(err.message);
     res.status(401).send("unauthorized user"+err);
    }
};

module.exports = userAuth;