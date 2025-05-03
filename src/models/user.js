const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// User Model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,  // means need not to worry of efficiency
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password :" + value);
        }
      },
    } ,
    age: {
      type: Number,
      required: false,
      min: 18,
    },
    gender: {
      type: String,
      enum : {
         values : ["male" , "female" , "others"],
         message : `{VALUE} is not a valid gender`
      },
      required: false,
      trim: true,
      validate(value) {
        if (!["male", "female", "others","Male", "Female", "Others"].includes(value)) {
          throw new Error("Not a valid gender (Male , Female and other)");
        }
      },
    },
    about: {
      type: String,
      default: "Dev is in search for someone here",
    },
    photoURL: {
      type: String,
      default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


// use ? 
// if there are million of entries , findOne will take alot of time to search
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getjwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, "999@Akshad", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isValidPassword;
};

mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);