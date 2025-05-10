const express = require('express');
const dotenv = require('dotenv');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
