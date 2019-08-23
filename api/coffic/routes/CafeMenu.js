const express 	= require("express");
const router 	= express.Router();


const cafeMenuController = require('../controllers/CafeMenu');


router.post('/post', cafeMenuController.submit_cafeItem);

router.patch('/patch/:id',cafeMenuController.updateItemSingle);

router.delete('/delete/:id',cafeMenuController.deleteItemSingle);

router.get('/get/List',cafeMenuController.get_cafeItemList);

router.get('/get/:id',cafeMenuController.get_cafeItemSingle);
 

module.exports = router;
