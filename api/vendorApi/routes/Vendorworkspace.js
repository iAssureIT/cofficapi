const express 	= require("express");
const router 	= express.Router();

/*1st table*/

const workspaceController = require('../controllers/Vendorworkspace');


router.post('/', workspaceController.create_Vendorworkspace);


router.get('/list',workspaceController.list_Vendorworkspace);


router.get('/:VendorworkspaceID',workspaceController.single_Vendorworkspace);


router.patch('/', workspaceController.update_Vendorworkspace);


router.delete('/:VendorworkspaceID',workspaceController.delete_Vendorworkspace);




module.exports = router;