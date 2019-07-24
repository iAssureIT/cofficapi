const express 	= require("express");
const router 	= express.Router();

/*1st table*/

const workspaceController = require('../controllers/workspaceDetails');


router.post('/', workspaceController.create_workspace);


router.get('/list',workspaceController.list_workspace);


router.get('/:workspaceID',workspaceController.single_workspace);


router.patch('/', workspaceController.update_workspace);


router.delete('/:workspaceID',workspaceController.delete_workspace);




module.exports = router;