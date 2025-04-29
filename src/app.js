const express = require('express');

const app = express();
// this funcion is known as request handler
app.use((req,res)=>{
    res.send("Hello from express server");

})

app.listen(3000,()=>{
    console.log("App is started at the port 3000");
});