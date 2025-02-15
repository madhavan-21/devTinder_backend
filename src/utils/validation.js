const validator = require("validator")

const validataorSignUpData = (req) =>{
    const {firstName , lastName , email,password} = req.body;
    if (!firstName || !lastName){
        //throw new Error("Invalid firstName or lastName")
        return false
    }else if (!validator.isEmail(email)){
       // throw new Error("Invalid email")
        return false
    }else if (!validator.isStrongPassword(password)){
        //throw new Error("Invalid password")
        return false
    }
    return true

}

const validateEditProfileData =(req)=>{
    const allowedEditFields=[
        "firstName",
        "lastName",
        "email",
        "password",
        "age",
        "gender",
        "about",
        "skils"
    ]

    const isallowedEditFields = Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    )
    return isallowedEditFields
}

module.exports = {validataorSignUpData,validateEditProfileData}