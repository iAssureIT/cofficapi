const express 	= require("express");
const router 	= express.Router();


const seatBookingController = require('../controllers/seatBooking');


router.post('/submit', seatBookingController.create_seatBooking);


router.get('/list',seatBookingController.list_seatBooking);


// router.get('/:seatBookingID',seatBookingController.single_seatBooking);


router.patch('/update', seatBookingController.update_seatBooking);


router.delete('/:seatBookingID',seatBookingController.delete_seatBooking);

module.exports = router;
