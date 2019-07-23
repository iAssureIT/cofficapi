const express 	= require("express");
const router 	= express.Router();


const subscriptionController = require('../controllers/subscription');


router.post('/', subscriptionController.create_workspace);


router.get('/list',subscriptionController.list_subscription);


router.get('/:subscriptionID',subscriptionController.single_subscription);


router.patch('/', subscriptionController.update_subscription);


router.delete('/:subscriptionID',subscriptionController.delete_subscription);

module.exports = router;
