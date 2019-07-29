const express 	= require("express");
const router 	= express.Router();


const projectSettingsController = require('../controllers/projectSettings');


router.post('/', projectSettingsController.create_projectSettings);


// router.get('/list',projectSettingsController.list_projectSettings);



module.exports = router;
