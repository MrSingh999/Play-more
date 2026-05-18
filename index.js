const express = require('express');
require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
const app = express();
const connectDB = require('./src/db/db.js');

// Global Middlewares
app.use(express.json()); // Required to parse req.body
app.use(cookieParser()); // Required to parse req.cookies

connectDB();
