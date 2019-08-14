const express 	= require("express");
const router 	= express.Router();


const OrdersController = require('../controllers/menuOrders');


router.post('/post', OrdersController.create_orders);


router.get('/get/list',OrdersController.list_orders);


// router.get('/:ordersID',ordersController.single_orders);


router.patch('patch/:ordersID', OrdersController.update_orders);


router.delete('/delete/:ordersID',OrdersController.delete_orders);
 

module.exports = router;
