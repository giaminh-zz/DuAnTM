const db = require('../config/db');

// API đặt sân
exports.bookCourt = async (req, res) => {
    try {
        const { user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount } = req.body;
        const [result] = await db.execute('INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount]);
        res.status(200).json({ id: result.insertId, user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error booking court' });
    }
};

// API xem lịch sử đặt sân của người dùng
exports.getBookingHistory = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const [rows] = await db.execute('SELECT * FROM bookings WHERE user_id = ?', [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking history' });
    }
};

// Cập nhật trạng thái đặt sân
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);

        res.status(200).json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating booking status' });
    }
};