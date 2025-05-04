const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
       
   const fromUserId = req.user._id;   
   const toUserId = req.params.toUserId;
   const status =  req.params.status;


   // checking if toUser exists or not
   const toUser = await User.findById({toUserId});

   if(!toUser){
     return res.status(404).json({
      message : "User not found",
  
     })
   }
   const allowedStatus = ["ignored","interested"];
   if(!allowedStatus.includes(status)){
     return res.status(400).json({
      message : "Inavalid status type"+ status,
     })
   }
    

  //  if there is an existing connection request between the two users, return an error
  const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (existingConnectionRequest) {
    return res
      .status(400)
      .send({ message: "Connection Request Already Exists!!" });
  }

   const connectionRequest = new ConnectionRequest({

      fromUserId, toUserId , status
   });

   const data = await connectionRequest.save();
   res.json({
    message:
      req.user.firstName + " is " + status + " in " + toUser.firstName,
    data,
  });
} catch (err) {
  res.status(400).send("ERROR: " + err.message);
}
}
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
     const allowedStatus = ["accepted" , "rejected"];

    //  validate status

      if(!allowedStatus.includes(status)){
        return res.status(400).json({
          message : "Invalid status or status not allowed",
        })
      }

      // validate request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });
      if(!connectionRequest){
        return res.status(404).json({
          message : "request not found",
        })
      }

      connectionRequest.status = status;  
      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection request " + status,
        data,
      });
    } 
    catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

module.exports = requestRouter; 