const express  =require("express");

const app = express();

// app.use("/user",(req,res)=>{
//     res.send("Hello , you are in the User page");
// })

// app.use("/price",(req,res)=>{
//     res.send("Hello , you are in the Pricing page");
// })

// app.use("/",(req,res)=>{
//     res.send("Hello , you are in the home page");
// })

app.get("/user/:id/:name",(req,res)=>{
    res.send(`Hello from user route : ${req.params.id} and ${req.params.name}`);
})

app.get("/",(req,res)=>{
   res.send("I am on the home page")
})



app.listen(3000,()=>{
    console.log("App is started at the port 3000");
})