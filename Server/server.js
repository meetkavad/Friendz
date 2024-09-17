const express = require("express");
const app = express();

const authRouter = require("./routers/authRouter.js");
const userRouter = require("./routers/userRouter.js");

const connectDB = require("./db/connect.js");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));
app.use("/Friendz/v1", authRouter);
app.use("/Friendz/v1/userin", userRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("db connected");
    app.listen(port, console.log(`server is listening at port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
