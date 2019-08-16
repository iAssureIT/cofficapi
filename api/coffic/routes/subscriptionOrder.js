const express 	= require("express");
const router 	= express.Router();


const subscriptionOrderController = require('../controllers/subscriptionOrder');


router.post('/post', subscriptionOrderController.submit_subscriptionOrder);

router.get('/get/one/:suborderID', subscriptionOrderController.detail_subscriptionOrder);

router.get('/get/list', subscriptionOrderController.list_subscriptionOrder); 



module.exports = router;
