const pool = require('../models/db');

// Create attendance
const markAttendance = async (req, res) => {
  const { studentId, status } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO attendance (student_id, status) VALUES ($1, $2) RETURNING *",
      [studentId, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//save company detais
const saveCompanyDetails = async (req, res) => {
  const {name,gstNo,address,city,state,adminName,adminEmail } = req.body;  
  try {
    const result = await pool.query(
      "INSERT INTO companyees (company_name, gst_no,address,city,state,admin_name,admin_email) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name,gstNo,address,city,state,adminName,adminEmail]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attendance
const getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance for a student
const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM attendance WHERE student_id = $1", [studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dbHealth = async (req,res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.send('✅ DB connection is healthy');
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).send('❌ DB connection error');
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth,
  saveCompanyDetails
};
