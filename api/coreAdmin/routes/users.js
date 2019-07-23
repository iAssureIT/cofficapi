const express 	= require("express");
const router 	= express.Router();


const checkAuth     = require('../middlerware/check-auth');

const UserController = require('../controllers/users');

router.post('/', UserController.user_signup); 

router.post('/login',UserController.user_login); 

router.post('/userslist',UserController.users_fetch); 

router.post('/verify_mobile/',UserController.users_verify_mobile); 

router.get('/list', UserController.users_list); 

router.get('/verify_mobile/',UserController.users_verify_mobile); 

router.get('/userslist', UserController.users_directlist); 



router.get('/:userID',UserController.user_details); 





router.delete('/:userID',UserController.delete_user);

// router.put('/',UserController.user_update);  

router.put('/:userID',UserController.update_user);  

router.patch('/:rolestatus',UserController.user_change_role);  


//========  Manage OTP  ===========

const OTPController = require('../controllers/otp');
router.post('/otpverification',OTPController.generate_otp);


module.exports = router;