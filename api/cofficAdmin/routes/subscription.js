const express 	= require("express");
const router 	= express.Router();


const subscriptionController = require('../controllers/subscription');

router.post('/', subscriptionController.create_subscription);

router.get('/single/:subscriptionID',subscriptionController.single_subscription);

router.get('/list',subscriptionController.list_subscription);

router.post('/edit/:subscriptionID', subscriptionController.update_subscription);

router.delete('/single/:subscriptionID',subscriptionController.delete_subscription);

module.exports = router;
