const db = require('../config/db');

// Thêm sân mới
exports.addCourt = async (req, res) => {
    try {
        const { name, id_areas, id_field_types, id_users, status, price, image, description } = req.body;
        const [result] = await db.execute(
            'INSERT INTO courts (name, id_areas, id_field_types, id_users, status, price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, id_areas, id_field_types, id_users, status, price, image, description]
        );
        res.status(200).json({ id: result.insertId, name, id_areas, id_field_types, id_users, status, price, image, description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding court' });
    }
};

// Sửa thông tin sân
exports.updateCourt = async (req, res) => {
    try {
        const { name, id_areas, id_field_types, id_users, status, price, image, description } = req.body;
        const id = req.params.id;
        await db.execute(
            'UPDATE courts SET name = ?, id_areas = ?, id_field_types = ?, id_users = ?, status = ?, price = ?, image = ?, description = ? WHERE id = ?',
            [name, id_areas, id_field_types, id_users, status, price, image, description, id]
        );
        res.status(200).json({ id, name, id_areas, id_field_types, id_users, status, price, image, description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating court' });
    }
};

// Xóa sân
exports.deleteCourt = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM courts WHERE id = ?', [id]);
        res.status(200).json({ message: 'Court deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting court' });
    }
};

// Lấy thông tin sân theo id
exports.getCourtById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM courts WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Court not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting court' });
    }
};

// Lấy tất cả sân
exports.getAllCourts = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM courts');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting courts' });
    }
};

// Tìm kiếm sân
exports.searchCourts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM courts WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching courts' });
    }
};

// Cập nhật trạng thái phê duyệt của sân
exports.updateApprovalStatus = async (req, res) => {
    try {
        const { approval_status } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE courts SET approval_status = ? WHERE id = ?', [approval_status, id]);
        res.status(200).json({ id, approval_status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating approval status of court' });
    }
};