const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
   fromUserId : {
    type : mongoose.Schema.ObjectId,
    ref : "User", // builing relation bw two tables   
    required : true,
   },
   toUserId : {
    type : mongoose.Schema.ObjectId,
    ref: "User",
    required : true,
   },
   status : {
     type : String,
     enum : {
        values : ["ignored" , "interested" , "accepted" , "rejected"],
        message : `{values} is incorrect status type`
    },
    required : true,
   }
},
{
   timestamps : true,
}
);

// compound index 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
   const connectionRequest = this;
 
   //chekc is fromUserId is same as toUserId
   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
     throw new Error("You Cannot send connection request to yourself");
   }
   next();
 });


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {
   ConnectionRequestModel
}