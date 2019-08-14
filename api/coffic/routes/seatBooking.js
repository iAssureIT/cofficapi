const express 	= require("express");
const router 	= express.Router();


const seatBookingController = require('../controllers/seatBooking');


router.post('/post', seatBookingController.create_seatBooking);

router.get('/get/list',seatBookingController.list_seatBooking);

// router.get('/:seatBookingID',seatBookingController.single_seatBooking);

router.patch('/patch/update/:seatBooking_ID', seatBookingController.update_seatBooking);

router.delete('/delete/:seatBookingID',seatBookingController.delete_seatBooking);

module.exports = router;
