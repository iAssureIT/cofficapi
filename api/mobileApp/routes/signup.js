const express 	= require("express");

const router 	= express.Router();

const checkAuth     = require('../middlerware/check-auth');

const SignupController = require('../controllers/signup');


router.post('/post', SignupController.user_signupmobile); 

router.post('/post/customer', SignupController.user_createcustomer);

router.post('/post/login',SignupController.user_login); 

router.post('/post/forgot-pwd',SignupController.forgot_pwd); 

router.post('/post/userslist',SignupController.users_fetch); 

router.post('/post/searchValue',SignupController.user_search); 

// router.post('/post/officesearchValue',SignupController.search_user_office); 

router.post('/post/statusaction',SignupController.account_status); 

router.post('/post/roleadd',SignupController.account_role_add); 

router.post('/post/roledelete',SignupController.account_role_remove); 

router.get('/post/list', SignupController.users_list); 

// router.get('/userslist', UserController.users_directlist); 

router.get('/get/count', SignupController.users_count); 

router.patch('/patch/one/:userID',SignupController.update_user); 

router.patch('/patch/:rolestatus',SignupController.user_change_role);  

router.post('/verify_mobileOTP',SignupController.users_verify_mobileOTP); 

router.post('/confirmOTP',SignupController.confirmOTP); 

router.get('/get/one/:userID',SignupController.user_details); 

router.put('/put/one/resetpwd/:userID',SignupController.update_user_resetpassword);  

router.delete('/delete/one/:userID',SignupController.delete_user);

router.delete('/',SignupController.deleteall_user);  

module.exports = router;