// import express, { Application, Request, Response, NextFunction } from 'express';
const express = require('express')
const bodyParser = require('body-parser');
import { Client, Pool } from 'pg';
//import editstd from './editstd';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_management',
    password: '123456',
    port: 5432,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../Frontend')));
/*****************REGISTER****************/
app.post('/register', async (req: any, res: any) => {
    const { username, password } = req.body;
    console.log('Received register request:', req.body);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        console.log('Result:', result.rows[0]);
        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
        return;
    } catch (err) {
        console.log('Error:', err);
        if (err === '23505') {
            res.status(409).send('Username already exists');
            return ;
        }
        res.status(500).send('Error registering user');
    }
});
/********************LOGIN***********************/
app.post('/login', async (req: any, res: any) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        console.log("request body", req.body);

        if (!user || !(await bcrypt.compare(password, user.password))) {
             res.status(401).send('Invalid credentials');
             return;
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});


/***********ADD STUDENT DETAIL**************/

app.post('/api/addStudent', async (req: any, res: any) => {
    const { studentId, name, class: classValue, email } = req.body;
    console.log("Received student data:", req.body);

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query(
                'INSERT INTO students(studentId, name, class, email) VALUES ($1, $2, $3, $4) RETURNING studentId',
                [studentId, name, classValue, email]
            );
            await client.query('COMMIT');
            res.status(201).send('Student added successfully');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error adding student:', error);
            res.status(500).json({error:'Error adding student'});
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Error connecting to the database');
    }
});

/**********GET ALL STUDENT DETAIL**********/
app.get('/api/getStudents', async (req: any, res: any) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM students');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

/*******DELETE STUDENT DETAIL**********/
app.delete('/api/deleteStudent/:studentId', async (req: any, res: any) => {
    const studentId = req.params.studentId;

    try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const result = await client.query('DELETE FROM students WHERE studentId = $1 RETURNING studentId', [studentId]);
        await client.query('COMMIT');
        client.release();
        if (result.rows.length > 0) {
            res.status(200).send('Student deleted successfully');
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
});

/*************GET STUDENT DETAIL USING STUDENTID************/
app.get('/api/getStudents/:studentId', async (req: any, res: any) => {
    const studentId = req.params.studentId;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM students WHERE studentId = $1', [studentId]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Error fetching student');
    }
});

app.get('/api/students/:studentId', async (req: any, res: any) => {
    try {
        const { studentId } = req.params;

        const result = await pool.query(
            'SELECT * FROM students WHERE student_id = $1', 
            [studentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Update student
app.put('/api/students/:studentId', async (req: any, res: any) => {
    try {
        const { studentId } = req.params;
        const { name, class: className, email } = req.body;

        console.log('Updating student:', studentId);

        const result = await pool.query(
            `UPDATE students 
             SET name = $1, class = $2, email = $3 
             WHERE "studentid" = $4 
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

/****Attendance table*/
app.post('/api/attendance', async (req:any, res:any) => {
    const { records } = req.body;
    console.log('Received attendance data:', req.body);

  
    try {
      const insertPromises = records.map((record: any) => {
        return pool.query(
          'INSERT INTO attendance (studentid, status, date) VALUES ($1, $2, CURRENT_DATE)',
          [record.studentId, record.status]
        );
      });
  
      await Promise.all(insertPromises);
      res.status(200).send('Attendance recorded');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error recording attendance');
    }
  });
/****attendance count */
app.get('/attendance/count', async (req: any, res: any) => {
    try {
      const totalStudentsResult = await pool.query('SELECT COUNT(*) FROM students');
      const totalStudents = parseInt(totalStudentsResult.rows[0].count, 10);
  
      const attendanceResult = await pool.query(`
        SELECT 
          COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present,
          COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent
        FROM attendance
        WHERE date = CURRENT_DATE
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

/*******attendance lastest update******/

app.get("/latest-attendance-summary", async (req: any, res: any) => {
    try {
      // Step 1: Get the latest submission timestamp
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
  
      // Step 2: Get only records matching that exact timestamp
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
  
  /******Mark Sheet********/
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
