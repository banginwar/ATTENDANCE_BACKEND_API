const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../uploads/' });

const {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth,
  saveCompanyDetails,
  encrypt,
  uploadEmpCsv
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/', getAllAttendance);
router.get('/attendanceapi/dbhealth',dbHealth);
router.get('/:studentId', getStudentAttendance);
router.post('/attendanceapi/savecompanydetails', saveCompanyDetails); 
router.post('/attendanceapi/login', encrypt); 
router.post('/attendanceapi/uploadempcsv',upload.single('file'), uploadEmpCsv); 

module.exports = router;
