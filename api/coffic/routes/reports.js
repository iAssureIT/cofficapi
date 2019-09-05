const express 	= require("express");
const router 	= express.Router();


const reportController = require('../controllers/reports.js');

router.get('/get/vendormonthly/:startDate/:endDate/:workspace_ID',reportController.vendor_monthly);

router.get('/get/vendordailycheckins/:workspace_ID',reportController.vendor_dailycheckins);
 

module.exports = router;


