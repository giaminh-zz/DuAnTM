const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Đặt sân
router.post('/book', bookingController.bookCourt);

// Xem lịch sử đặt sân
router.get('/history/:user_id', bookingController.getBookingHistory);

// API cập nhật trạng thái đặt sân
router.put('/:id/update-status', bookingController.updateBookingStatus);

module.exports = router;