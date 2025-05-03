const validator = require('validator');   
const validateSignUpData = (req) =>{
    const {emailId , firstName , lastName , password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Please enter a valid user name");
    }
    if(validator.isEmail(emailId) === false){
        throw new Error("Please enter a valid Email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Please make a strong password for yourself")
    }
}

module.exports = {
    validateSignUpData
}