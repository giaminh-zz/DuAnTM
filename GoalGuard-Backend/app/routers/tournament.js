const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/tournamentController');

// Thêm giải đấu mới
router.post('/', TournamentController.addTournament);

// Sửa thông tin giải đấu
router.put('/:id', TournamentController.updateTournament);

// Xóa giải đấu
router.delete('/:id', TournamentController.deleteTournament);

// Lấy thông tin giải đấu theo id
router.get('/:id', TournamentController.getTournamentById);

// Lấy tất cả các giải đấu
router.get('/', TournamentController.getAllTournaments);

// Tìm kiếm giải đấu
router.get('/search', TournamentController.searchTournaments);

// Phê duyệt giải đấu
router.put('/:id/approve', TournamentController.approveTournament);

module.exports = router;
