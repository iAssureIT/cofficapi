const express 	= require("express");
const router 	= express.Router();

const CompanySettingController = require('../controllers/companysettings');

router.post('/', CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.list_companysettings);

router.get('/:companysettingsID', CompanySettingController.detail_companysettings);

// router.patch('/:info/:action', CompanySettingController.update_companysettings);


router.patch('/companyLocationsInfo', CompanySettingController.update_companysettings_companyLocationsInfo);

router.patch('/taxSettings', CompanySettingController.update_companysettings_taxSettings);

router.patch('/info', CompanySettingController.update_companysettings_info);

router.delete('/:companysettingsID',CompanySettingController.delete_companysettings);


module.exports = router;