const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: String,
        required: [true, 'Please add a starting location']
    },
    to: {
        type: String,
        required: [true, 'Please add a destination']
    },
    date: {
        type: String,
        required: [true, 'Please add a departure date']
    },
    time: {
        type: String,
        required: [true, 'Please add a departure time']
    },
    carModel: {
        type: String,
        default: 'Unknown Car Model'
    },
    seats: {
        type: Number,
        required: [true, 'Please add available seats'],
        min: [0, 'Cannot have negative seats'],
        max: [8, 'Cannot exceed 8 seats']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price per seat']
    },
    passengers: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        name: String
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        name: String,
        text: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', RideSchema);
