const express 	= require("express");
const router 	= express.Router();


const seatBookingController = require('../controllers/seatBooking');


router.post('/post/checkinUser', seatBookingController.chekinUser);

router.get('/get/list',seatBookingController.list_seatBooking);

router.get('/get/one/:user_id',seatBookingController.list_userSeatBooking);

router.get('/get/availableSeats/:workspace_id',seatBookingController.availableSeats);

router.get('/get/dailyCheckInReport/:workspace_id',seatBookingController.dailyCheckins_Report);

router.get('/get/dailyOrderReport/:workspace_id',seatBookingController.dailyOrder_Report);

router.get('/get/dailyBeverageReport/:workspace_id',seatBookingController.dailyBeverage_Report);

router.patch('/patch/chechout/', seatBookingController.checkoutUser);

router.get('/validate/:user_id',seatBookingController.validate_checkin);

module.exports = router;
