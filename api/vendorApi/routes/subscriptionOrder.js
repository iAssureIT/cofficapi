const express 	= require("express");
const router 	= express.Router();


const subscriptionOrderController = require('../controllers/subscriptionOrder');


router.post('/submitOrder', subscriptionOrderController.submit_subscriptionOrder);

module.exports = router;
