const express 	= require("express");
const router 	= express.Router();


const reportController = require('../controllers/reports.js');

router.get('/get/vendormonthly/:startDate/:endDate/:workspace_ID',reportController.vendor_monthly);

router.get('/get/vendordailycheckins/:workspace_ID',reportController.vendor_dailycheckins);
 
router.get('/get/checkInOut/:type/:startDate/:endDate/:workSpace_id',reportController.checkInOut);

//type : checkIn or checkOut or both

router.get('/get/cafewisebooking' ,reportController.cafewiseSeatBooking);

router.get('/get/sales/:startDate/:endDate/:plan_ID/:typeUser',reportController.salesTransaction);

// router.get('/get/subscription/:startDate/:endDate',reportController.subscription);

router.get('/get/settlementReportSummary/:startDate/:endDate',reportController.settlementSummary);

router.get('/get/settlementReportDetail/:startDate/:endDate/:vendor_ID',reportController.settlementDetail);

router.get('/get/dashboard',reportController.dashboardBlock);

router.get('/get/bankreport/:startDate/:endDate',reportController.bankreport);
module.exports = router;


