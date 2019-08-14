const express 	= require("express");
const router 	= express.Router();


const subscriptionOrderController = require('../controllers/subscriptionOrder');


router.post('/submit', subscriptionOrderController.submit_subscriptionOrder);

router.get('/', subscriptionOrderController.detail_subscriptionOrder);

router.get('/list', subscriptionOrderController.list_subscriptionOrder); 

router.get('/delete', subscriptionOrderController.delete_subscriptionOrder); 

router.get('/update', subscriptionOrderController.update_subscriptionOrder); 



module.exports = router;
