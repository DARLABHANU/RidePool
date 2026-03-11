const express = require('express');
const router = express.Router();
const {
    createRide,
    getRides,
    getMyRides,
    bookRide,
    getMyBookings,
    completeRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRide)  // Must be logged in to publish a ride
    .get(getRides);            // Anyone can view available rides

router.get('/myrides', protect, getMyRides);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/book', protect, bookRide);
router.put('/:id/complete', protect, completeRide);

module.exports = router;
