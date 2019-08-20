const express 	= require("express");
const router 	= express.Router();


const seatBookingController = require('../controllers/seatBooking');


router.post('/post', seatBookingController.create_seatBooking);

router.get('/get/list',seatBookingController.list_seatBooking);

router.get('/get/one/:user_id',seatBookingController.list_userSeatBooking);

router.get('/get/count',seatBookingController.list_checkIncount);

router.patch('/patch/update/:seatBooking_ID', seatBookingController.update_seatBooking);

router.delete('/delete/:seatBookingID',seatBookingController.delete_seatBooking);

router.get('/validate/:user_id',seatBookingController.validate_checkin);


module.exports = router;
