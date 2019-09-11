const express 	= require("express");
const router 	= express.Router();


const reportController = require('../controllers/reports.js');

router.get('/get/vendormonthly/:startDate/:endDate/:workspace_ID',reportController.vendor_monthly);

router.get('/get/vendordailycheckins/:workspace_ID',reportController.vendor_dailycheckins);
 
// router.get('/get/checkInOut/:type/:startDate/:endDate/:workspace_ID',reportController.checkInOut);


router.get('/get/checkInOut/:workSpace_id',reportController.checkInOut);

router.get('/get/cafewisebooking/:workSpace_id',reportController.cafewiseSeatBooking);

//type : checkIn or checkOut or both
module.exports = router;


