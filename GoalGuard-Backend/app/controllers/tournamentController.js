const db = require('../config/db');

// Thêm giải đấu mới
exports.addTournament = async (req, res) => {
    try {
        const { name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image } = req.body;
        const [result] = await db.execute('INSERT INTO tournaments (name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image]);
        res.status(200).json({ id: result.insertId, name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding tournament' });
    }
};

// Sửa thông tin giải đấu
exports.updateTournament = async (req, res) => {
    try {
        const { name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE tournaments SET name = ?, info = ?, teams = ?, matches = ?, group_count = ?, prizes = ?, status = ?, approval_status = ?, id_users = ?, image = ? WHERE id = ?', [name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image, id]);
        res.status(200).json({ id, name, info, teams, matches, group_count, prizes, status, approval_status, id_users, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating tournament' });
    }
};

// Xóa giải đấu
exports.deleteTournament = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM tournaments WHERE id = ?', [id]);
        res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting tournament' });
    }
};

// Lấy thông tin giải đấu theo id
exports.getTournamentById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM tournaments WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Tournament not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament' });
    }
};

// Lấy tất cả các giải đấu
exports.getAllTournaments = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tournaments');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournaments' });
    }
};

// Tìm kiếm giải đấu
exports.searchTournaments = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM tournaments WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching tournaments' });
    }
};

// Phê duyệt giải đấu
exports.approveTournament = async (req, res) => {
    try {
        const id = req.params.id;
        const { approval_status } = req.body; 
        // Kiểm tra xem giải đấu tồn tại không
        const [tournament] = await db.execute('SELECT * FROM tournaments WHERE id = ?', [id]);
        if (tournament.length === 0) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Cập nhật trạng thái phê duyệt của giải đấu với giá trị mới
        await db.execute('UPDATE tournaments SET approval_status = ? WHERE id = ?', [approval_status, id]);
        res.status(200).json({ message: 'Tournament approval status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating tournament approval status' });
    }
};

// Lấy thông tin giải đấu theo id người dùng
exports.getTournamentsByUser = async (req, res) => {
    try {
        const id_users = req.params.id;
        const [rows] = await db.execute('SELECT t.*, u.username AS user_name FROM tournaments t JOIN users u ON t.id_users = u.id WHERE t.id_users = ?', [id_users]);
       
            res.status(200).json(rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournaments by user id' });
    }
};

