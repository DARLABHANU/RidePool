const Ride = require('../models/Ride');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
    const { from, to, date, time, seats, price, carModel } = req.body;

    try {
        const ride = await Ride.create({
            driver: req.user._id,
            from,
            to,
            date,
            time,
            seats,
            price,
            carModel: carModel || 'Unknown Car Model'
        });

        res.status(201).json(ride);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all available rides (Search)
// @route   GET /api/rides
// @access  Public
const getRides = async (req, res) => {
    const { from, to, date } = req.query;

    // Build query based on search parameters if provided
    let query = {};
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (date) query.date = date;

    try {
        // Populate driver info so we can show name and ratings on frontend
        const rides = await Ride.find(query)
            .populate('driver', 'name phone rating numReviews')
            .sort({ createdAt: -1 });

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get rides for specific logged-in user
// @route   GET /api/rides/myrides
// @access  Private
const getMyRides = async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Book a ride
// @route   PUT /api/rides/:id/book
// @access  Private
const bookRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.driver.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot book your own ride' });
        }

        if (ride.passengers.some(p => p.user && p.user.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'You have already booked this ride' });
        }

        const seatsToBook = Number(req.body.seatsToBook) || 1;
        const passengerNames = req.body.passengerNames || [];

        if (seatsToBook < 1 || seatsToBook > ride.seats) {
            return res.status(400).json({ message: 'Invalid number of seats selected' });
        }

        if (ride.seats >= seatsToBook) {
            ride.seats -= seatsToBook;
            for(let i = 0; i < seatsToBook; i++) {
                ride.passengers.push({
                    user: req.user._id,
                    name: passengerNames[i] || req.user.name || 'Passenger'
                });
            }
            await ride.save();

            // Emit notification to driver
            if (req.io) {
                req.io.to(ride.driver.toString()).emit('notification', {
                    type: 'RIDE_BOOKED',
                    message: `Someone just booked ${seatsToBook} seat(s) on your ride from ${ride.from} to ${ride.to}`,
                    userId: ride.driver.toString()
                });
            }

            res.json({ message: 'Ride booked successfully', ride });
        } else {
            res.status(400).json({ message: 'No seats available' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get rides booked by specific logged-in user
// @route   GET /api/rides/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const rides = await Ride.find({ 'passengers.user': req.user._id })
            .populate('driver', 'name phone rating')
            .sort({ date: 1, time: 1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete a ride
// @route   PUT /api/rides/:id/complete
// @access  Private
const completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to complete this ride' });
        }

        ride.status = 'completed';
        await ride.save();

        res.json({ message: 'Ride marked as completed', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRide,
    getRides,
    getMyRides,
    bookRide,
    getMyBookings,
    completeRide
};
