const express = require("express");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const app = express();
// const dotenv = require("dotenv");
// dotenv.config({});
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//routes
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//database connect before server
connectDB().then(() => {
  try {
    app.listen(3000, () => {
      console.log(`Server running on ` + 3000);
    });
  } catch (error) {
    console.log(error);
  }
});