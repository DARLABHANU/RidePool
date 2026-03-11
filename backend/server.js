const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const Ride = require('./models/Ride');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make io accessible to routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Implement Chat & Notifications Socket Logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins their personal notification room
    socket.on('join_user', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined personal room`);
    });

    // User joins a ride-specific chat room
    socket.on('join_ride_chat', (rideId) => {
        socket.join(`ride_${rideId}`);
        console.log(`User joined chat for ride ${rideId}`);
    });

    // Handle incoming chat messages
    socket.on('send_message', async (data) => {
        // data: { rideId, senderId, senderName, text }
        try {
            const ride = await Ride.findById(data.rideId);
            if (ride) {
                const newMessage = {
                    sender: data.senderId,
                    name: data.senderName,
                    text: data.text,
                    timestamp: new Date()
                };
                ride.messages.push(newMessage);
                await ride.save();
                
                // Emit strictly back to the designated chat room
                io.to(`ride_${data.rideId}`).emit('receive_message', newMessage);

                // Send a notification bell alert
                if (ride.driver.toString() !== data.senderId) {
                    // Notify Driver
                    io.to(ride.driver.toString()).emit('notification', {
                        type: 'NEW_MESSAGE',
                        message: `💬 New message from ${data.senderName} on your ride to ${ride.to}`
                    });
                } else {
                    // Notify Passengers
                    ride.passengers.forEach(p => {
                        if (p.user) {
                            io.to(p.user.toString()).emit('notification', {
                                type: 'NEW_MESSAGE',
                                message: `💬 New message from your driver on your ride to ${ride.to}`
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error saving chat message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/requests', require('./routes/requests'));

app.get('/', (req, res) => {
    res.send('RidePool API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
