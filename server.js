const express = require('express');
const dotenv = require('dotenv');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
   // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
