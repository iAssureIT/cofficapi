const express 	= require("express");
const router 	= express.Router();


const subscriptionPlansController = require('../controllers/subscriptionPlan');


router.post('/post', subscriptionPlansController.create_subscriptionPlan);

router.get('/get/list',subscriptionPlansController.list_subscriptionPlan);

router.get('/get/:subscriptionPlansID',subscriptionPlansController.single_subscriptionPlan);

router.patch('/patch/update/:id', subscriptionPlansController.update_subscriptionPlan);

router.delete('/delete/:subscriptionPlansID',subscriptionPlansController.delete_subscriptionPlan);

module.exports = router;
