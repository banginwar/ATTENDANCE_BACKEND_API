const { body, param,validationResult } = require('express-validator');

exports.validateAttendance = [
  body('studentId').isInt().withMessage('studentId must be an integer'),
  body('status').isIn(['present', 'absent']).withMessage('status must be present or absent')
];

exports.validateCompanyDetails = [
  body('name').notEmpty().withMessage('Company name is required'),
  body('gstNo').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/).withMessage('Invalid GST number format'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('adminName').notEmpty().withMessage('Admin name is required'),
  body('adminEmail').isEmail().withMessage('Invalid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('reqPassword').isLength({ min: 5 }).withMessage('Password too short')
];

exports.validateStudentId = [
  param('studentId').isInt().withMessage('studentId must be an integer')
];
