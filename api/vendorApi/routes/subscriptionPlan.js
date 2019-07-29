const express 	= require("express");
const router 	= express.Router();


const subscriptionPlansController = require('../controllers/subscriptionPlans');


router.post('/', subscriptionPlansController.create_subscriptionPlans);


router.get('/list',subscriptionPlansController.list_subscriptionPlans);


router.get('/:subscriptionPlansID',subscriptionPlansController.single_subscriptionPlans);


router.patch('/', subscriptionPlansController.update_subscriptionPlans);


router.delete('/:subscriptionPlansID',subscriptionPlansController.delete_subscriptionPlans);

module.exports = router;
