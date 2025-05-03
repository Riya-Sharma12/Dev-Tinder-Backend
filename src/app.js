 const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const {validateSignUpData } = require("./utils/validation.js"); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());


app.get("/user" ,async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        res.send({emailId : userEmail});
    }
    catch(err){
        res.status(404).send("Error in fetching user",err);
    }
   
})

app.delete("/user", async(req,res)=>{
   const id = req.body.userId;
   try{
    const user = await User.findByIdAndDelete(id);  
    if(!user){
        return res.status(404).send("User not found");
    }

    res.send("User deleted Successfully");
   }
   catch(err){
    res.status(404).send("Error detected while deleting the user")
   }
})


// updating the user details->
app.patch("/user",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.data;

    const AllowedUpdates = ["age" , "userId" , "gender", "photoUrl", "skills", "about"];
    const isUpdateAllowed = Object.keys(data).every((k)=>{
         AllowedUpdates.includes(k);
    })

    if(!isUpdateAllowed){
       throw new Error("Updation in the given field is not allowed");
    }

    try{
        User.findByIdAndUpdate({_id : userId},data);
        res.send("data updated Successfully")
    }
    catch(err){
        res.status(404).send("Error in updating the user",err);
    }

})

app.post("/login", async(req,res)=>{
  try{
   const {emailId , password} = req.body;
const user = await User.findOne({emailId : emailId});
if(!user){
    throw new Error("User not found with this emailId");
}
const isValidPassword = await  bcrypt.compare(password, user.password);

if(isValidPassword){
    res.cookie("token","absjbdhfidjffbjdfkdgnkdj");
    res.send("User logged in successfully")
}
  }catch(err){
    console.log(err);
  }
})
app.post("/signup",async (req,res)=>{
//    const userObj = {
//     firstName : "Riya",
//     lastName : "Sharma",
//     emailId : "riya@gmail.com",
//     password : "riya123",
//    };
// //  creating a new Instance of the user model
//     const user = new User(userObj);

//    await user.save();
//    res.send("User added Successfully")

try{ 
    // validate the user
    validateSignUpData(req);
    // encrypt the password
    const {password} = req.body;
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash)
    const user = new User(req.body);
    await user.save();
    res.send("User added Successfully");
}
catch(err){
    res.status(404).send("Error in adding user",err);
}

})

app.post('/profile', userAuth , async(req,res)=>{
   // after getting logged in , verify the cookie
   const cookies = req.cookies;
    if(!cookies || !cookies.token){
     return res.status(401).send("User not logged in");
    } 
})
connectDB().then(()=>{
    console.log("Databse connection successfully");
    app.listen(3000,()=>{
        console.log("App is started at the port 3000");
    });
})
.catch((err)=>{
    console.log("Error in database connection",err)
})


