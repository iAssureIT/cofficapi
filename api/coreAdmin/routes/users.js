const express 	= require("express");

const router 	= express.Router();

const checkAuth     = require('../middlerware/check-auth');

const UserController = require('../controllers/users');

// router.post('/', UserController.user_signup); 

router.post('/post', UserController.user_signupadmin); 

router.get('/get/single/:user_id', UserController.id_cafeAdmin); 

router.post('/post/mobSignup',UserController.user_signupmobile);

router.post('/post/vendor', UserController.user_createVendor);

router.post('/post/admin', UserController.user_loginwithadmin);

router.post('/post/loginwithvendor',UserController.user_loginwithvendor); 

router.post('/post/loginwithuser',UserController.user_loginwithuser); 

router.post('/post/forgot-pwd',UserController.forgot_pwd); 

router.post('/post/forgotpwdOTP',UserController.user_otpverification_forgotpassword); 

router.post('/post/otpverificationsend',UserController.user_otpverification); 


router.post('/post/userslist',UserController.users_fetch); 

router.post('/post/searchValue',UserController.user_search); 

router.post('/post/officesearchValue',UserController.search_user_office); 

router.post('/post/statusaction',UserController.account_status); 

router.post('/post/roleadd',UserController.account_role_add); 

router.post('/post/roledelete',UserController.account_role_remove); 

router.get('/get/list', UserController.users_list); 

// router.get('/userslist', UserController.users_directlist); 

router.get('/get/count', UserController.users_count); 

router.patch('/patch/one/:userID',UserController.update_user); 

router.patch('/patch/:rolestatus',UserController.user_change_role);  

// router.post('/verify_mobileOTP',UserController.users_verify_mobileOTP); 

// router.post('/confirmOTP',UserController.confirmOTP); 

router.get('/get/one/:userID',UserController.user_details); 

router.put('/put/one/resetpwd/:userID',UserController.update_user_resetpassword);  

router.delete('/delete/one/:userID',UserController.delete_user);

router.delete('/',UserController.deleteall_user);  



module.exports = router;