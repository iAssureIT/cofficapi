const express 	= require("express");
const router 	= express.Router();

/*1st table*/

const workspaceController = require('../controllers/workspaceDetails');

console.log("in work spacerouter---list---------->");
router.post('/', workspaceController.create_workspace);

// router.post('/',(res,req,next)=>{
// 	console.log('Post router');
// })


router.get('/list', workspaceController.list_workspace);


router.get('/:workspaceID',workspaceController.single_workspace);


router.post('/update/:id', workspaceController.update_workspace);


router.delete('/:workspaceID',workspaceController.delete_workspace);




module.exports = router;