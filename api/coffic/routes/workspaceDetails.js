const express 	= require("express");
const router 	= express.Router();

/*1st table*/

const workspaceController = require('../controllers/workspaceDetails');

console.log("in work spacerouter---list---------->");



router.post('/post', workspaceController.create_workspace);

router.get('/get/list', workspaceController.list_workspace);

router.get('/get/one/:workspaceID',workspaceController.single_workspace);

router.patch('/patch/update/:workspaceID', workspaceController.update_workspace);

router.delete('/delete/:workspaceID',workspaceController.delete_workspace);




module.exports = router;