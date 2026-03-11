const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create a new emergency tow request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    const { location, estimatedDistance, estimatedPrice } = req.body;

    try {
        const request = await ServiceRequest.create({
            user: req.user._id,
            location,
            estimatedDistance,
            estimatedPrice
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's past emergency requests
// @route   GET /api/requests/myrequests
// @access  Private
const getMyRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all emergency requests (Admin only)
// @route   GET /api/requests
// @access  Private/Admin
const getAllRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({}).populate('user', 'name phone').sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status (Admin only)
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        const updatedRequest = await request.save();

        // Emit real-time notification
        if (req.io) {
            req.io.to(request.user.toString()).emit('notification', {
                type: 'TOW_UPDATE',
                message: `Your tow request has been updated to: ${status}`,
                userId: request.user.toString()
            });
        }

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
};
