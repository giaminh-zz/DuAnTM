const db = require('../config/db');

// Thêm kết quả giải đấu
exports.addTournamentResult = async (req, res) => {
    try {
        const { tournament_id, result_info, image } = req.body;
        const [result] = await db.execute('INSERT INTO tournament_results (tournament_id, result_info, image) VALUES (?, ?, ?)', [tournament_id, result_info, image]);
        res.status(200).json({ id: result.insertId, tournament_id, result_info, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding tournament result' });
    }
};

// Sửa kết quả giải đấu
exports.updateTournamentResult = async (req, res) => {
    try {
        const { tournament_id, result_info, image } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE tournament_results SET tournament_id = ?, result_info = ?, image = ? WHERE id = ?', [tournament_id, result_info, image, id]);
        res.status(200).json({ id, tournament_id, result_info, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating tournament result' });
    }
};

// Xóa kết quả giải đấu
exports.deleteTournamentResult = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM tournament_results WHERE id = ?', [id]);
        res.status(200).json({ message: 'Tournament result deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting tournament result' });
    }
};

// Lấy thông tin kết quả giải đấu theo id
exports.getTournamentResultById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM tournament_results WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Tournament result not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament result' });
    }
};

// Lấy tất cả kết quả giải đấu
exports.getAllTournamentResults = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tournament_results');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament results' });
    }
};

// Tìm kiếm kết quả giải đấu
exports.searchTournamentResults = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM tournament_results WHERE result_info LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching tournament results' });
    }
};
