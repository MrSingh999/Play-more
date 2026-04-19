const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));

// routes import
const userRouter = require("./routes/user.router.js")
app.use("/users", userRouter)


module.exports =  app ;
