const express 	= require("express");

const router 	= express.Router();

const checkAuth     = require('../middlerware/check-auth');

const OtpController = require('../controllers/Otp');

  

router.post('/verify_mobileOTP',OtpController.users_verify_mobileOTP); 

router.post('/confirmOTP',OtpController.confirmOTP); 

router.get('/get/one/:userID',OtpController.user_details); 
 

module.exports = router;