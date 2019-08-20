const express 	= require("express");
const router 	= express.Router();


const OrdersController = require('../controllers/menuOrders');


router.post('/post', OrdersController.create_orders);


router.get('/get/list',OrdersController.list_orders);


router.get('/get/one/:user_id',OrdersController.detail_userorders);


router.patch('patch/:ordersID', OrdersController.update_orders);


router.delete('/delete/:ordersID',OrdersController.delete_orders);
 

module.exports = router;
