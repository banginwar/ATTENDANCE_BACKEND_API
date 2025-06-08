// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: '../uploads/' });

// const {
//   markAttendance,
//   getAllAttendance,
//   getStudentAttendance,
//   dbHealth,
//   saveCompanyDetails,
//   encrypt,
//   uploadEmpCsv
// } = require('../controllers/attendanceController');

// router.post('/', markAttendance);
// router.get('/', getAllAttendance);
// router.get('/attendanceapi/dbhealth',dbHealth);
// router.get('/:studentId', getStudentAttendance);
// router.post('/attendanceapi/savecompanydetails', saveCompanyDetails); 
// router.post('/attendanceapi/login', encrypt); 
// router.post('/attendanceapi/uploadempcsv',upload.single('file'), uploadEmpCsv); 

// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');
const validator = require('../utils/validators');
const multer = require('multer');
const upload = multer({ dest: '../uploads/' });


// router.post('/', validator.validateAttendance, controller.markAttendance);
// router.get('/', controller.getAllAttendance);
// router.get('/:studentId', validator.validateStudentId, controller.getStudentAttendance);
// router.post('/attendanceapi/savecompanydetails', validator.validateCompanyDetails, controller.saveCompanyDetails);
// router.post('/attendanceapi/login', validator.validateLogin, controller.encrypt);
// router.get('/attendanceapi/dbhealth', controller.dbHealth);
// router.post('/attendanceapi/uploadempcsv', upload.single('file'), controller.uploadEmpCsv);

const {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth,
  saveCompanyDetails,
  encrypt,
  uploadEmpCsv,
  saveImpImageVector,
  matchImageVector
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/', getAllAttendance);
router.get('/attendanceapi/dbhealth',dbHealth);
router.get('/:studentId', getStudentAttendance);
router.post('/attendanceapi/savecompanydetails', validator.validateCompanyDetails, saveCompanyDetails); 
router.post('/attendanceapi/login', encrypt); 
router.post('/attendanceapi/uploadempcsv',upload.single('file'), uploadEmpCsv); 
router.post('/attendanceapi/saveimagevector',upload.single('file'), saveImpImageVector); 
router.post('/attendanceapi/matchimagevector', upload.single('file'), matchImageVector); 

module.exports = router;

