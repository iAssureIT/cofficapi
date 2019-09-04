const express 	= require("express");
const router 	= express.Router();


const seatBookingController = require('../controllers/seatBooking');


router.post('/post/checkinUser', seatBookingController.chekinUser);

router.get('/get/list',seatBookingController.list_seatBooking);

router.get('/get/list/available',seatBookingController.list_seatBooking_available);

router.get('/get/one/:user_id',seatBookingController.list_userSeatBooking);

router.get('/get/availableSeats/:workspace_id',seatBookingController.availableSeats);


router.patch('/patch/chechout/', seatBookingController.checkoutUser);

router.get('/validate/:user_id',seatBookingController.validate_checkin);

module.exports = router;
