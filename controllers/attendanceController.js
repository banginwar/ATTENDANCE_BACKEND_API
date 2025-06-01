const pool = require('../models/db');
const bcrypt = require('bcryptjs')

const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
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
    const companyResult = await pool.query(
      "INSERT INTO companyees (company_name, gst_no,address,city,state,admin_name,admin_email) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name,gstNo,address,city,state,adminName,adminEmail]
    );
    if(companyResult.rows[0].id>0){
      console.log("Company details saved successfully with id :",companyResult.rows[0].id);
      const password = 'attendance@' + companyResult.rows[0].id; // Generate a default password
    const empPassword = await bcrypt.hash(password, 8)  
    console.log("emp normal password",password)
    console.log("emp hash password",empPassword)
      const empResult = await pool.query(
        "INSERT INTO employees (user_name,email,password) VALUES ($1,$2,$3) RETURNING email,password",
        [adminName,adminEmail,empPassword]
      );
      let userResult={};
      userResult.email=empResult.rows[0].email;
      userResult.password=password;
      res.status(200).json(userResult);
    }else{
      res.status(201).json({ message: "Company details not saved" });
    }
    
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

//encript password functions
const encrypt = async (req,res) => {
  try{
    const {email,reqPassword } = req.body; 
    const password = reqPassword;
    if(!email || !password){
      return res.status(400).send('Email and password are required');
    }
    console.log(email)
   // const hashedPassword = await bcrypt.hash(password, 8)
    const empresult = await pool.query("SELECT id,password FROM employees where email = $1 order by id  DESC limit 1",[email]);
    console.log("emp result",empresult.rows);
    if(empresult.rows.length === 0){
      return res.status(404).send('No employee found');
    }else{
      console.log("emp result",empresult.rows[0])
      const hashedPassword=empresult.rows[0].password;
      console.log(password)
    console.log(hashedPassword)
  
    const isMatch = await bcrypt.compare(password, hashedPassword)
    console.log(isMatch)
    if(isMatch){
      res.status(200).send('login success');
    }else{
      res.status(401).send('login unsuccess');
    }
    }    
    
  }catch (err) {
    console.error('Somthing went wrong', err);
    res.status(500).send('login unsuccess');
  }
 
}


const dbHealth = async (req,res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.send('✅ DB connection is healthy');
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).send('❌ DB connection error');
  }
};

const uploadEmpCsv= async (req, res) => {
  console.log(req.file);
  const filePath = req.file.path;
  
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      try {
        for (const row of results) {
          console.log(row);
          await pool.query(
            'INSERT INTO employees (user_name, email) VALUES ($1, $2)',
            [row.name, row.email]
          );
        }
        //fs.unlinkSync(filePath); // Cleanup uploaded file
        res.send('CSV processed and data inserted.');
      } catch (err) {
        console.error('Insert error:', err);
        res.status(500).send('Database insert failed.');
      }
    })
    .on('error', (err) => {
      console.error('CSV parse error:', err);
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
  uploadEmpCsv

};
