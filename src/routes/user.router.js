const registerUser = require('../controllers/user.controller.js');

const router = require('express').Router();

router.route('/register').post(registerUser);

module.exports =  router ;
