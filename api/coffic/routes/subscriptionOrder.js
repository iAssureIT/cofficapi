const express 	= require("express");
const router 	= express.Router();


const subscriptionOrderController = require('../controllers/subscriptionOrder');


router.post('/post', subscriptionOrderController.submit_subscriptionOrder);

router.get('/get/:suborderID', subscriptionOrderController.detail_subscriptionOrder);

router.get('/get/list', subscriptionOrderController.list_subscriptionOrder); 

router.delete('/delete/:suborderID', subscriptionOrderController.delete_subscriptionOrder); 

router.patch('/patch/:id', subscriptionOrderController.update_subscriptionOrder); 



module.exports = router;
