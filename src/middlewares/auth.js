 const jwt = require("jsonwebtoken");
 const User = require('../models/user')

 const userAuth = async (req,res , next)=>{

    try{
    //  read the token , validate the user , and find the user in the database
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        res.status(401).send("Please Login or SignUp!") 
    }

   const decodedObj = await jwt.verify(token, " dev@Tinder@1234");
   const {_id} = decodedObj;
   const user = await User.findById(_id);
   if(!user){
    throw new Error("User not found");
   }
   req.user = user;
    next();
    }
    catch(err){
        res.status(401).send("Authentication failed",err);
    }
 }

 module.exports = {
    userAuth,
 }