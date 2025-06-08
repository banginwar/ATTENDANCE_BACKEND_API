const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const csv = require('csv-parser');
const fs = require('fs');
const { validationResult } = require('express-validator');

// Helper: Validate inputs
const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// 1. Mark Attendance
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const getModel = require('../models/vector');
//for image processing

async function imageToTensor(imagePath) {
  const buffer = await sharp(imagePath).resize(224, 224).toFormat('png').toBuffer();
  const imageTensor = tf.node.decodeImage(buffer, 3).expandDims(0).toFloat().div(tf.scalar(255));
  return imageTensor;
}

async function getImageVector(imagePath) {
  const model = await getModel();
  const imageTensor = await imageToTensor(imagePath);
  const prediction = model.predict(imageTensor);
  return prediction.squeeze().array(); // vector as plain array
}

const saveImpImageVector=async (req, res) => {
  let empId= req.body.empId;
  //const filePath = req.file.path;
  let storedVectors = [];
  const vector = await getImageVector(req.file.path);
  const vectorStr = '[' + vector.map(x => Number(x).toFixed(6)).join(',') + ']';

  console.log(vectorStr)

  try {
    const result = await pool.query(
      "INSERT INTO employee_signature (emp_id, vectors) VALUES ($1, $2) RETURNING *",
      [empId, vectorStr]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 // storedVectors.push({ name: req.file.originalname, vector });
}

// Create attendance
const markAttendance = async (req, res) => {
  if (validateRequest(req, res)) return;

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

// 2. Save Company Details
const saveCompanyDetails = async (req, res) => {
  if (validateRequest(req, res)) return;
  const { name, gstNo, address, city, state, adminName, adminEmail } = req.body;
  try {
    const companyResult = await pool.query(
      `INSERT INTO companyees (company_name, gst_no, address, city, state, admin_name, admin_email)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, gstNo, address, city, state, adminName, adminEmail]
    );
    if (companyResult.rows.length) {
      const password = 'attendance@' + companyResult.rows[0].id;
      const empPassword = await bcrypt.hash(password, 8);
      const empResult = await pool.query(
        "INSERT INTO employees (user_name,email,password) VALUES ($1,$2,$3) RETURNING email,password",
        [adminName, adminEmail, empPassword]
      );
      res.status(200).json({
        email: empResult.rows[0].email,
        password // plain text password to be shown only once
      });
    } else {
      res.status(500).json({ message: "Company details not saved" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get All Attendance
const getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get Student Attendance
const getStudentAttendance = async (req, res) => {
  if (validateRequest(req, res)) return;

  const { studentId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM attendance WHERE student_id = $1", [studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. encript password functions
const encrypt = async (req, res) => {
  if (validateRequest(req, res)) return;

  const { email, reqPassword } = req.body;

  try {
    const empResult = await pool.query(
      "SELECT id, password FROM employees WHERE email = $1 ORDER BY id DESC LIMIT 1",
      [email]
    );

    if (!empResult.rows.length) {
      return res.status(404).send('No employee found');
    }

    const isMatch = await bcrypt.compare(reqPassword, empResult.rows[0].password);
    if (isMatch) {
      res.status(200).send('Login success');
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (err) {
    res.status(500).send('Login error');
  }
};

// 6. DB Health
const dbHealth = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.send('✅ DB connection is healthy');
  } catch (err) {
    res.status(500).send('❌ DB connection error');
  }
};

// 7. Upload Employees via CSV
const uploadEmpCsv = async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).send('CSV file is required');

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      try {
        for (const row of results) {
          if (!row.name || !row.email) continue;
          await pool.query(
            'INSERT INTO employees (user_name, email) VALUES ($1, $2)',
            [row.name, row.email]
          );
        }
<<<<<<< HEAD
=======
        fs.unlinkSync(filePath); // Cleanup uploaded file
>>>>>>> 7a78af7619a0268c6799383bcde7b6c7e0b21d79
        res.send('CSV processed and data inserted.');
      } catch (err) {
        res.status(500).send('Database insert failed.');
      }
    })
    .on('error', (err) => {
      res.status(400).send('Failed to parse CSV.');
    });
 
  // Process the CSV file here
  // You can use a library like csv-parser or papaparse to parse the CSV data

 // res.send('CSV file uploaded successfully');
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  dbHealth,
  saveCompanyDetails,
  encrypt,
  uploadEmpCsv,
  saveImpImageVector

};
