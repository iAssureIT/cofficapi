const express 	= require("express");
const router 	= express.Router();


const cafeMenuController = require('../controllers/CafeMenu');


router.post('/submitItem', cafeMenuController.submit_cafeItem);
router.post('/updateItem/:id',cafeMenuController.updateItemSingle);
router.delete('/deleteItem/:id',cafeMenuController.deleteItemSingle);


router.get('/getItemList',cafeMenuController.get_cafeItemList);
router.get('/getItem/:id',cafeMenuController.get_cafeItemSingle);



// router.get('/:ordersID',ordersController.single_orders);


// router.patch('/', ordersController.update_orders);


// router.delete('/:ordersID',ordersController.delete_orders);
 

module.exports = router;
