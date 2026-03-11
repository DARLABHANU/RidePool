const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load Models
const User = require('./models/User');
const Ride = require('./models/Ride');
const ServiceRequest = require('./models/ServiceRequest');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear out existing database data completely
        await User.deleteMany();
        await Ride.deleteMany();
        await ServiceRequest.deleteMany();
        console.log('🧹 Purged existing database records.');

        // 1. Create Mock Users
        const users = await User.create([
            { name: 'RidePool Admin', email: 'admin@ridepool.com', phone: '9998887776', password: 'password123', role: 'admin', rating: 4.9, numReviews: 24 },
            { name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9876543210', password: 'password123', role: 'user', rating: 4.5, numReviews: 8 },
            { name: 'Priya Sharma', email: 'priya@example.com', phone: '9123456780', password: 'password123', role: 'user', rating: 4.8, numReviews: 12 },
            { name: 'Kiran Rao', email: 'kiran@example.com', phone: '9988776655', password: 'password123', role: 'user', rating: 5.0, numReviews: 2 }
        ]);
        console.log('👤 Created Users! (Login password for all: password123)');

        const adminUser = users[0];
        const driver1 = users[1];
        const driver2 = users[2];
        const passenger = users[3];

        // 2. Create Mock Rides
        const rides = await Ride.create([
            {
                driver: driver1._id,
                from: 'Visakhapatnam',
                to: 'Vijayawada',
                date: '2026-03-20',
                time: '08:00 AM',
                seats: 2, // Originally 3, but 1 seat booked by passenger
                price: 500,
                carModel: 'White Suzuki Swift',
                status: 'active',
                passengers: [{ user: passenger._id, name: passenger.name }] // Passenger booked this ride
            },
            {
                driver: driver2._id,
                from: 'Hyderabad',
                to: 'Bangalore',
                date: '2026-03-25',
                time: '10:30 AM',
                seats: 4,
                price: 1200,
                carModel: 'Silver Hyundai Creta',
                status: 'active',
                passengers: [] // Empty ride looking for passengers
            },
            {
                driver: driver1._id,
                from: 'Mumbai',
                to: 'Pune',
                date: '2026-02-15', // Past date
                time: '06:00 AM',
                seats: 0,
                price: 300,
                carModel: 'Black Toyota Innova',
                status: 'completed', // Already completed
                passengers: [
                    { user: passenger._id, name: passenger.name },
                    { user: adminUser._id, name: adminUser.name }
                ] // Both rode this trip
            }
        ]);
        console.log('🚘 Created Mock Carpool Rides');

        // 3. Create Mock Service (Tow) Requests
        const requests = await ServiceRequest.create([
            {
                user: passenger._id,
                location: { lat: 17.6868, lng: 83.2185 }, // Near Vizag
                estimatedDistance: 15,
                estimatedPrice: 850,
                status: 'pending' // Waiting for Admin to Accept
            },
            {
                user: driver2._id,
                location: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
                estimatedDistance: 5,
                estimatedPrice: 350,
                status: 'accepted' // Admin Accepted, waiting to mark completed
            },
            {
                user: driver1._id,
                location: { lat: 19.0760, lng: 72.8777 }, // Mumbai
                estimatedDistance: 25,
                estimatedPrice: 1500,
                status: 'completed' // Finished tow request
            }
        ]);
        console.log('🚜 Created Mock Tow Truck Requests');

        console.log('✅ Synthetic Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
