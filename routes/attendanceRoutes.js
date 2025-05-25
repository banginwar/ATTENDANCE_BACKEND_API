const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/', getAllAttendance);
router.get('/dbhealth',dbHealth);
router.get('/:studentId', getStudentAttendance);

module.exports = router;
