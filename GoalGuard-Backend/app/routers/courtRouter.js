const express = require('express');
const router = express.Router();
const CourtController = require('../controllers/courtController');

router.get('/user/:id', CourtController.getCourtsByUserId);
router.get('/area/:id', CourtController.getCourtsByAreaId); 
router.post('/add', CourtController.addCourt);
router.put('/update/:id', CourtController.updateCourt);
router.delete('/delete/:id', CourtController.deleteCourt);
router.get('/:id', CourtController.getCourtById);
router.get('/', CourtController.getAllCourts);
router.get('/search', CourtController.searchCourts);
router.put('/:id/update-approval-status', CourtController.updateApprovalStatus);

module.exports = router;
