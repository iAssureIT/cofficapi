const express 	= require("express");
const router 	= express.Router();

/*1st table*/

const workspaceController = require('../controllers/workspaceDetails');


router.post('/post', workspaceController.create_workspace);

router.post('/post/list/', workspaceController.list_workspace);

router.get('/get/list/', workspaceController.alllist_workspace);

router.get('/get/single/:user_id', workspaceController.id_cafeAdmin); 

router.post('/cafesearch', workspaceController.cafe_search);



router.get('/get/list/city', workspaceController.listcity_workspace);

router.get('/get/one/:workspaceID',workspaceController.single_workspace);

router.patch('/patch/status/:workspaceID',workspaceController.update_workspacestatus);

router.patch('/patch/update/:workspaceID', workspaceController.update_workspace);

router.delete('/delete/:workspaceID',workspaceController.delete_workspace);

// router.get('/get/banklist',workspaceController.list_bankdetails);

// router.get('/get/one:workspaceID',workspaceController.single_seatNumbers);



/*Reports API's*/


router.get('/get/dailyCheckInReport/:workspace_id',workspaceController.dailyCheckins_Report);

// router.get('/get/dailyOrderReport/:workspace_id',workspaceController.dailyOrder_Report);






module.exports = router;