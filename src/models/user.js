const mongoose = require('mongoose');
const validator = require('validator');    
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required: true,
        trim : true,
        lowercase : true,
        validate(value){
            if(validator.isEmail(value) == false){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
    },
    age:{
        type:Number
    },
    gender : {
        type:String,
    },
    photoUrl :{
        type:String,
        default :" ",
    },
    skills : {
        type :[String],
    },
    about :{
        type: String,
        default : " This is the default about of the user"
    }
},
{
    timestamps : true
}

);

module.exports = mongoose.model('User',userSchema);
