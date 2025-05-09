"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Application, Request, Response, NextFunction } from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const pg_1 = require("pg");
//import editstd from './editstd';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const pool = new pg_1.Pool({
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
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log('Received register request:', req.body);
    try {
        const hashedPassword = yield bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);
        const result = yield pool.query('INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username', [username, hashedPassword]);
        console.log('Result:', result.rows[0]);
        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
        return;
    }
    catch (err) {
        console.log('Error:', err);
        if (err === '23505') {
            res.status(409).send('Username already exists');
            return;
        }
        res.status(500).send('Error registering user');
    }
}));
/********************LOGIN***********************/
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const result = yield pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        console.log("request body", req.body);
        if (!user || !(yield bcrypt.compare(password, user.password))) {
            res.status(401).send('Invalid credentials');
            return;
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (err) {
        res.status(500).send('Error logging in');
    }
}));
/***********ADD STUDENT DETAIL**************/
app.post('/api/addStudent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, name, class: classValue, email } = req.body;
    console.log("Received student data:", req.body);
    try {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN');
            const result = yield client.query('INSERT INTO students(studentId, name, class, email) VALUES ($1, $2, $3, $4) RETURNING studentId', [studentId, name, classValue, email]);
            yield client.query('COMMIT');
            res.status(201).send('Student added successfully');
        }
        catch (error) {
            yield client.query('ROLLBACK');
            console.error('Error adding student:', error);
            res.status(500).json({ error: 'Error adding student' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Error connecting to the database');
    }
}));
/**********GET ALL STUDENT DETAIL**********/
app.get('/api/getStudents', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM students');
        client.release();
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
}));
/*******DELETE STUDENT DETAIL**********/
app.delete('/api/deleteStudent/:studentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.params.studentId;
    try {
        const client = yield pool.connect();
        yield client.query('BEGIN');
        const result = yield client.query('DELETE FROM students WHERE studentId = $1 RETURNING studentId', [studentId]);
        yield client.query('COMMIT');
        client.release();
        if (result.rows.length > 0) {
            res.status(200).send('Student deleted successfully');
        }
        else {
            res.status(404).send('Student not found');
        }
    }
    catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
}));
/*************GET STUDENT DETAIL USING STUDENTID************/
app.get('/api/getStudents/:studentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.params.studentId;
    try {
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM students WHERE studentId = $1', [studentId]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).send('Student not found');
        }
    }
    catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Error fetching student');
    }
}));
app.get('/api/students/:studentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const result = yield pool.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Update student
app.put('/api/students/:studentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { name, class: className, email } = req.body;
        console.log('Updating student:', studentId);
        const result = yield pool.query(`UPDATE students 
             SET name = $1, class = $2, email = $3 
             WHERE "studentid" = $4 
             RETURNING *`, [name, className, email, studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
/****Attendance table*/
app.post('/api/attendance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { records } = req.body;
    console.log('Received attendance data:', req.body);
    try {
        const insertPromises = records.map((record) => {
            return pool.query('INSERT INTO attendance (studentid, status, date) VALUES ($1, $2, CURRENT_DATE)', [record.studentId, record.status]);
        });
        yield Promise.all(insertPromises);
        res.status(200).send('Attendance recorded');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error recording attendance');
    }
}));
/****attendance count */
app.get('/attendance/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalStudentsResult = yield pool.query('SELECT COUNT(*) FROM students');
        const totalStudents = parseInt(totalStudentsResult.rows[0].count, 10);
        const attendanceResult = yield pool.query(`
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
    }
    catch (err) {
        console.error('Error calculating attendance counts:', err);
        res.status(500).send('Server error');
    }
}));
/*******attendance lastest update******/
app.get("/latest-attendance-summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Step 1: Get the latest submission timestamp
        const latestTimestampResult = yield pool.query(`
        SELECT attendance_date 
        FROM attendance 
        ORDER BY attendance_date DESC 
        LIMIT 1
      `);
        const latestTimestamp = (_a = latestTimestampResult.rows[0]) === null || _a === void 0 ? void 0 : _a.attendance_date;
        if (!latestTimestamp) {
            return res.status(404).json({ message: "No attendance found" });
        }
        // Step 2: Get only records matching that exact timestamp
        const summaryResult = yield pool.query(`SELECT status, COUNT(*) AS count
         FROM attendance
         WHERE attendance_date = $1
         GROUP BY status`, [latestTimestamp]);
        res.json({ date: latestTimestamp, summary: summaryResult.rows });
    }
    catch (error) {
        console.error("Error getting latest attendance summary:", error);
        res.status(500).send("Server error");
    }
}));
/******Mark Sheet********/
app.post('/api/marks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const record of req.body.records) {
            yield pool.query(`INSERT INTO marks (student_id, tamil, english, math, science, social, average) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, [record.studentId, record.tamil, record.english, record.math, record.science, record.social, record.average]);
        }
        res.status(200).send("Marks stored successfully.");
    }
    catch (err) {
        console.error("Error inserting marks:", err);
        res.status(500).send("Error storing marks.");
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
