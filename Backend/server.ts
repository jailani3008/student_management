require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(cors({
  origin: 'https://sm-frontend-eight.vercel.app',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../Frontend')));


// **************** REGISTRATION ****************
app.post('/register', async (req:any, res:any) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err:any) {
    if (err.code === '23505') { // Unique violation - username exists
      res.status(409).send('Username already exists');
    } else {
      console.error('Register error:', err);
      res.status(500).send('Error registering user');
    }
  }
});


// **************** LOGIN ****************
app.post('/login', async (req:any, res:any) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Error logging in');
  }
});


// ********** ADD STUDENT DETAIL **********
app.post('/api/addStudent', async (req:any, res:any) => {
  const { studentId, name, class: classValue, email } = req.body;
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query(
      'INSERT INTO students(studentid, name, class, email) VALUES ($1, $2, $3, $4) RETURNING studentid',
      [studentId, name, classValue, email]
    );
    await client.query('COMMIT');
    res.status(201).send('Student added successfully');
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Error adding student' });
  } finally {
    if (client) client.release();
  }
});


// ********** GET ALL STUDENT DETAIL **********
app.get('/api/getStudents', async (req:any, res:any) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  } finally {
    if (client) client.release();
  }
});


// ******** DELETE STUDENT DETAIL ********
app.delete('/api/deleteStudent/:studentId', async (req:any, res:any) => {
  const studentId = req.params.studentId;
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const result = await client.query(
      'DELETE FROM students WHERE studentid = $1 RETURNING studentid',
      [studentId]
    );
    await client.query('COMMIT');

    if (result.rows.length > 0) {
      res.status(200).send('Student deleted successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error:any) {
    if (client) await client.query('ROLLBACK');
    console.error('Error deleting student:', error);
    res.status(500).send('Error deleting student: ' + error.message);
  } finally {
    if (client) client.release();
  }
});


// ***** GET STUDENT DETAIL BY ID *****
app.get('/api/getStudents/:studentId', async (req:any, res:any) => {
  const studentId = req.params.studentId;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM students WHERE studentid = $1', [studentId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send('Error fetching student');
  } finally {
    if (client) client.release();
  }
});


// ****** UPDATE STUDENT DETAIL ******
app.put('/api/students/:studentId', async (req:any, res:any) => {
  const { studentId } = req.params;
  const { name, class: className, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students 
       SET name = $1, class = $2, email = $3 
       WHERE studentid = $4 
       RETURNING *`,
      [name, className, email, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ****** RECORD ATTENDANCE *******
app.post('/api/attendance', async (req:any, res:any) => {
  const { records } = req.body;
  try {
    const insertPromises = records.map((record: { studentId: any; status: any; }) =>
      pool.query(
        'INSERT INTO attendance (studentid, status, attendance_date) VALUES ($1, $2, CURRENT_DATE)',
        [record.studentId, record.status]
      )
    );
    await Promise.all(insertPromises);
    res.status(200).send('Attendance recorded');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error recording attendance');
  }
});


// ****** ATTENDANCE COUNT FOR DASHBOARD ******
app.get('/attendance/count', async (req:any, res:any) => {
  try {
    const totalStudentsResult = await pool.query('SELECT COUNT(*) FROM students');
    const totalStudents = parseInt(totalStudentsResult.rows[0].count, 10);

    const attendanceResult = await pool.query(`
      SELECT 
          COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present,
          COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent
      FROM attendance
      WHERE attendance_date = CURRENT_DATE
    `);
    const { present, absent } = attendanceResult.rows[0];
    const percentage = totalStudents === 0 ? 0 : (present / totalStudents) * 100;

    res.json({
      totalStudents,
      present,
      absent,
      percentage: percentage.toFixed(2),
    });
  } catch (err) {
    console.error('Error calculating attendance counts:', err);
    res.status(500).send('Server error');
  }
});


// ******** LATEST ATTENDANCE SUMMARY *********
app.get("/latest-attendance-summary", async (req:any, res:any) => {
  try {
    const latestTimestampResult = await pool.query(`
      SELECT attendance_date 
      FROM attendance 
      ORDER BY attendance_date DESC 
      LIMIT 1
    `);
    const latestTimestamp = latestTimestampResult.rows[0]?.attendance_date;

    if (!latestTimestamp) {
      return res.status(404).json({ message: "No attendance found" });
    }

    const summaryResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM attendance
       WHERE attendance_date = $1
       GROUP BY status`,
      [latestTimestamp]
    );

    res.json({ date: latestTimestamp, summary: summaryResult.rows });
  } catch (error) {
    console.error("Error getting latest attendance summary:", error);
    res.status(500).send("Server error");
  }
});


// ******** MARKSHEET ENTRY *********
app.post('/api/marks', async (req:any, res:any) => {
  try {
    for (const record of req.body.records) {
      await pool.query(
        `INSERT INTO marks (student_id, tamil, english, math, science, social, average) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [record.studentId, record.tamil, record.english, record.math, record.science, record.social, record.average]
      );
    }
    res.status(200).send("Marks stored successfully.");
  } catch (err) {
    console.error("Error inserting marks:", err);
    res.status(500).send("Error storing marks.");
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
