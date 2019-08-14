const express 	= require("express");
const router 	= express.Router();


const projectSettingsController = require('../controllers/projectSettings');


router.post('/'         ,projectSettingsController.create_projectSettings);
// router.get('/list'      ,projectSettingsController.list_project);
router.get('/single/:type'    ,projectSettingsController.fetch_projectsettings); 



module.exports = router;
