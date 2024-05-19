const db = require('../config/db');

// Thêm khu vực mới
exports.addArea = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Kiểm tra xem tên khu vực đã tồn tại trong cơ sở dữ liệu chưa
        const [existingAreas] = await db.execute('SELECT id FROM areas WHERE name = ?', [name]);
        if (existingAreas.length > 0) {
            return res.status(200).json({ message: 'Tên khu vực đã tồn tại' });
        }

        // Tiến hành thêm khu vực mới
        const [result] = await db.execute('INSERT INTO areas (name, status) VALUES (?, ?)', [name, status]);
        res.status(200).json({ id: result.insertId, name, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding area' });
    }
};

// Sửa thông tin khu vực
exports.updateArea = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;

        // Kiểm tra xem tên khu vực mới không trùng với các tên khu vực khác (trừ chính khu vực đang cập nhật)
        if (name !== undefined) {
            const [existingAreas] = await db.execute('SELECT id FROM areas WHERE name = ? AND id != ?', [name, id]);
            if (existingAreas.length > 0) {
                return res.status(200).json({ message: 'Tên khu vực đã tồn tại' });
            }
        }

        // Tiếp tục quá trình cập nhật khu vực
        await db.execute('UPDATE areas SET name = ? WHERE id = ?', [name, id]);
        res.status(200).json({ id, name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating area' });
    }
};

// Xóa khu vực
exports.deleteArea = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM areas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Area deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting area' });
    }
};

// Lấy thông tin khu vực theo id
exports.getAreaById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM areas WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Area not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting area' });
    }
};

// Lấy tất cả khu vực
exports.getAllAreas = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM areas');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting areas' });
    }
};

// Tìm kiếm khu vực
exports.searchAreas = async (req, res) => {
    try {
        let keyword = req.query.keyword;
        let rows;
        if (!keyword) {
            [rows] = await db.execute('SELECT * FROM areas');
        } else {
            [rows] = await db.execute('SELECT * FROM areas WHERE name LIKE ?', [`%${keyword}%`]);
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching areas' });
    }
};

