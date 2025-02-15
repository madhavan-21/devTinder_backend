const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName  :{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    lastName:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    email:{
        type:String,
        lowercase:true,
        required: true,
        unique: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
     type:String,
     required: true,
     validate(value){
        if (!validator.isStrongPassword(value)){
            throw new Error('Password must be at least 8 characters long, contain a uppercase letter, a lowercase letter, a number and a special character')
        }
     }
    },
    age:{
        type:Number,
        required: true,
        min: 18,
        max: 99
    },gender:{
        type:String,
        required:true,
        enum:{
            values:["male" ,"female" ," others"],
            message:`{VALUE} is not a valid gender`,
        }
    }, photoUrl:{
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
           if(!validator.isURL(value)){
            throw new Error('Invalid photoUrl')
           }
        }
    }, about:{
        type: String,
        default:"This is default about me for the user"
    },skils:{
        type:[String]
    }

},{
    timeStamps:true,
})
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"dev@dinder",{
        expiresIn: "7d"
    })
    console.log("token: " + token)
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const password = user.password;
  const isPasswordisvalid = await bcrypt.compare(passwordInputByUser , password)
  if (!isPasswordisvalid){
    throw new Error("Invalid password")
  }else{
    return isPasswordisvalid
  }
}
    

module.exports = mongoose.model("User", userSchema)