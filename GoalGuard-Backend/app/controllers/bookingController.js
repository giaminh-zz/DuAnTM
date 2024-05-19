const db = require('../config/db');
const moment = require('moment');


exports.bookCourt = async (req, res) => {
    try {
        const { user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount } = req.body;

        // Lấy tất cả các đặt sân trong khoảng thời gian này của sân đó
        const [existingBookings] = await db.execute('SELECT * FROM bookings WHERE court_id = ? AND booking_date = ?', [court_id, booking_date]);
        
        // Kiểm tra xem khoảng thời gian mới có chồng lên bất kỳ đặt sân nào khác không
        for (const booking of existingBookings) {
            const existingStartTime = moment(booking.start_time, 'HH:mm');
            const existingEndTime = moment(booking.end_time, 'HH:mm');

            const newStartTime = moment(start_time, 'HH:mm');
            const newEndTime = moment(end_time, 'HH:mm');

            // Kiểm tra xem thời gian đặt sân mới có chồng lên thời gian của các đặt sân khác không
            if (
                (newStartTime.isBetween(existingStartTime, existingEndTime, undefined, '[)') || 
                newEndTime.isBetween(existingStartTime, existingEndTime, undefined, '(]')) ||
                (existingStartTime.isBetween(newStartTime, newEndTime, undefined, '(]') ||
                existingEndTime.isBetween(newStartTime, newEndTime, undefined, '[)'))
            ) {
                return res.status(200).json({ message: 'Booking time conflicts with existing booking' });
            }
        }

        // Nếu không có xung đột, thêm đặt sân mới vào cơ sở dữ liệu
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
        const [rows] = await db.execute(`
            SELECT bookings.*, courts.name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            WHERE bookings.user_id = ?
        `, [user_id]);
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

// API lấy thông tin đặt sân của một chủ sân dựa trên user_id
exports.getBookingByUserID = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const [rows] = await db.execute(`
            SELECT 
                bookings.*, 
                courts.name AS court_name,
                users.username AS user_name,
                users.phone AS phone,
                owners.username AS owner_name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            INNER JOIN users ON bookings.user_id = users.id
            INNER JOIN users AS owners ON courts.id_users = owners.id
            WHERE courts.id_users = ?
        `, [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by user id' });
    }
};

// API lấy thông tin đặt sân theo court_id
exports.getBookingByCourtId = async (req, res) => {
    try {
        const court_id = req.params.court_id;
        const [rows] = await db.execute('SELECT * FROM bookings WHERE court_id = ?', [court_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by court id' });
    }
};

// API lấy thông tin đặt sân theo ID
exports.getBookingByID = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const [rows] = await db.execute(`
            SELECT 
                bookings.*, 
                courts.name AS court_name,
                users.username AS user_name,
                owners.username AS owner_name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            INNER JOIN users ON bookings.user_id = users.id
            INNER JOIN users AS owners ON courts.id_users = owners.id
            WHERE bookings.id = ?
        `, [bookingId]);
        res.status(200).json(rows[0]); // Trả về kết quả đầu tiên, vì chỉ có một đặt sân có ID tương ứng
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by ID' });
    }
};
