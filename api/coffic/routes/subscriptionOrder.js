const express 	= require("express");
const router 	= express.Router();


const subscriptionOrderController = require('../controllers/subscriptionOrder');


router.post('/post', subscriptionOrderController.submit_subscriptionOrder);

router.get('/get/one/:suborderID', subscriptionOrderController.detail_subscriptionOrder);

router.get('/get/list', subscriptionOrderController.list_subscriptionOrder);

router.get('/get/activesub/:user_id', subscriptionOrderController.single_activesub);

router.get('/get/allsub/:user_id', subscriptionOrderController.user_allsub); 

router.get('/quickwallet-redirecturl', subscriptionOrderController.paymentResponse);

router.get('/payment-success/:status/:id/:billnumbers', subscriptionOrderController.paymentSuccess);



module.exports = router;
