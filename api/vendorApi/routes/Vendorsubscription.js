const express 	= require("express");
const router 	= express.Router();


const VendorsubscriptionController = require('../controllers/Vendorsubscription');


router.post('/', VendorsubscriptionController.create_Vendorsubscription);


router.get('/list',VendorsubscriptionController.list_Vendorsubscription);


// router.get('/:VendorsubscriptionID',VendorsubscriptionController.single_Vendorsubscription);


router.patch('/', VendorsubscriptionController.update_Vendorsubscription);


router.delete('/:VendorsubscriptionID',VendorsubscriptionController.delete_Vendorsubscription);

module.exports = router;