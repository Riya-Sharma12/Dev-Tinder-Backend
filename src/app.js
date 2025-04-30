const express = require('express');
const connectDB = require("./config/database.js");


const app = express();
connectDB().then(()=>{
    console.log("Databse connection successfully");
    app.listen(3000,()=>{
        console.log("App is started at the port 3000");
    });
})
.catch((err)=>{
    console.log("Error in database connection",err)
})


