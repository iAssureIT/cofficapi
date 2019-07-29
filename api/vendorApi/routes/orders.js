const express 	= require("express");
const router 	= express.Router();


const ordersController = require('../controllers/orders');


router.post('/', ordersController.create_orders);


router.get('/list',ordersController.list_orders);


router.get('/:ordersID',ordersController.single_orders);


router.patch('/', ordersController.update_orders);


router.delete('/:ordersID',ordersController.delete_orders);
 

module.exports = router;
