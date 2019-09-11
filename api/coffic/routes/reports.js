const express 	= require("express");
const router 	= express.Router();


const reportController = require('../controllers/reports.js');

router.get('/get/vendormonthly/:startDate/:endDate/:workspace_ID',reportController.vendor_monthly);

router.get('/get/vendordailycheckins/:workspace_ID',reportController.vendor_dailycheckins);
 
router.get('/get/checkInOut/:type/:startDate/:endDate/:workSpace_id',reportController.checkInOut);


// router.get('/get/checkInOut/:workSpace_id',reportController.checkInOut);

router.get('/get/cafewisebooking' ,reportController.cafewiseSeatBooking);

//type : checkIn or checkOut or both

/*Sales Transaction Report*/

router.get('/get/sales/:startDate/:endDate/:plan_ID/:typeUser',reportController.salesTransaction);

/*subscription Details*/

router.get('/get/subscription/:startDate/:endDate',reportController.subscription);



module.exports = router;


