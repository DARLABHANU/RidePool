const express = require('express');
const router = express.Router();
const {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRequest) // Must be logged in to request a tow
    .get(protect, admin, getAllRequests); // Admin only to view all requests

router.get('/myrequests', protect, getMyRequests);
router.put('/:id/status', protect, admin, updateRequestStatus);

module.exports = router;
