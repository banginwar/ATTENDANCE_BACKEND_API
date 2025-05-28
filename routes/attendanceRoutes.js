const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth,
  saveCompanyDetails
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/', getAllAttendance);
router.get('/attendanceapi/dbhealth',dbHealth);
router.get('/:studentId', getStudentAttendance);
router.post('/attendanceapi/savecompanydetails', saveCompanyDetails); 

module.exports = router;
