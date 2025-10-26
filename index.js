const express = require('express');
require('dotenv').config({ path: './.env' });
const app = express();
const connectDB = require('./src/db/db.js');

connectDB();
