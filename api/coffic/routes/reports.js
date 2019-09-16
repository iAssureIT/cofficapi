const express 	= require("express");
const router 	= express.Router();


const reportController = require('../controllers/reports.js');

router.get('/get/vendormonthly/:startDate/:endDate/:workspace_ID/:startLimit/:endLimit',reportController.vendor_monthly);

router.get('/get/vendordailycheckins/:workspace_ID/:date/:startLimit/:endLimit',reportController.vendor_dailycheckins);
 
router.get('/get/checkInOut/:type/:startDate/:endDate/:workSpace_id/:startLimit/:endLimit',reportController.checkInOut);

//type : checkIn or checkOut or both

router.get('/get/cafewisebooking/:startLimit/:endLimit' ,reportController.cafewiseSeatBooking);

router.get('/get/sales/:startDate/:endDate/:plan_ID/:typeUser/:startLimit/:endLimit',reportController.salesTransaction);

// router.get('/get/subscription/:startDate/:endDate',reportController.subscription);

router.get('/get/settlementReportSummary/:startDate/:endDate/:startLimit/:endLimit',reportController.settlementSummary);

router.get('/get/settlementReportDetail/:startDate/:endDate/:vendor_ID/:startLimit/:endLimit',reportController.settlementDetail);

router.get('/get/dashboard',reportController.dashboardBlock);

router.get('/get/bankreport/:startDate/:endDate/:startLimit/:endLimit',reportController.bankreport);

router.get('/get/dailyBeverageReport/:date/:workspace_id/:startLimit/:endLimit',reportController.dailyBeverage_Report);

router.get('/get/dailyOrderReport/:date/:workspace_id/:startLimit/:endLimit',reportController.dailyOrder_Report);



module.exports = router;


