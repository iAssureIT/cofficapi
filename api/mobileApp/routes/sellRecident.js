const express 	= require("express");
const router 	= express.Router();

const SellRecidentController = require('../controllers/sellRecident');

router.post('/', SellRecidentController.create_sellRecidential);

router.get('/list',SellRecidentController.list_sellRecidential);

// router.get('/:sellRecidentsID', SellRecidentController.);

router.patch('/:info/:action', SellRecidentController.update_sellRecidential);
// router.patch('/:info/:action', CompanySettingController.update_companysettings);

// router.patch('/', SellRecidentController.);


router.delete('/:sellRecidentsID',SellRecidentController.delete_SellRecidential);


module.exports = router;