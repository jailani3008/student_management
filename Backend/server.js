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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Application, Request, Response, NextFunction } from 'express';
var express = require('express');
var bodyParser = require('body-parser');
var pg_1 = require("pg");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var path = require('path');
var app = express();
var port = 3000;
var pool = new pg_1.Pool({
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
app.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, hashedPassword, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                console.log('Received register request:', req.body);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                console.log('Hashed Password:', hashedPassword);
                return [4 /*yield*/, pool.query('INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username', [username, hashedPassword])];
            case 3:
                result = _b.sent();
                console.log('Result:', result.rows[0]);
                res.status(201).json({
                    message: 'User registered successfully',
                    user: result.rows[0]
                });
                return [2 /*return*/];
            case 4:
                err_1 = _b.sent();
                console.log('Error:', err_1);
                if (err_1 === '23505') {
                    res.status(409).send('Username already exists');
                    return [2 /*return*/];
                }
                res.status(500).send('Error registering user');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/********************LOGIN***********************/
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, result, user, _b, token, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, pool.query('SELECT * FROM users WHERE username = $1', [username])];
            case 2:
                result = _c.sent();
                user = result.rows[0];
                console.log("request body", req.body);
                _b = !user;
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 3:
                _b = !(_c.sent());
                _c.label = 4;
            case 4:
                if (_b) {
                    res.status(401).send('Invalid credentials');
                    return [2 /*return*/];
                }
                token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token: token });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _c.sent();
                res.status(500).send('Error logging in');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/***********ADD STUDENT DETAIL**************/
app.post('/api/addStudent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, name, classValue, email, client, result, error_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, studentId = _a.studentId, name = _a.name, classValue = _a.class, email = _a.email;
                console.log("Received student data:", req.body);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 7, 9, 10]);
                return [4 /*yield*/, client.query('BEGIN')];
            case 4:
                _b.sent();
                return [4 /*yield*/, client.query('INSERT INTO students(studentId, name, class, email) VALUES ($1, $2, $3, $4) RETURNING studentId', [studentId, name, classValue, email])];
            case 5:
                result = _b.sent();
                return [4 /*yield*/, client.query('COMMIT')];
            case 6:
                _b.sent();
                res.status(201).send('Student added successfully');
                return [3 /*break*/, 10];
            case 7:
                error_1 = _b.sent();
                return [4 /*yield*/, client.query('ROLLBACK')];
            case 8:
                _b.sent();
                console.error('Error adding student:', error_1);
                res.status(500).json({ error: 'Error adding student' });
                return [3 /*break*/, 10];
            case 9:
                client.release();
                return [7 /*endfinally*/];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_2 = _b.sent();
                console.error('Error connecting to the database:', error_2);
                res.status(500).send('Error connecting to the database');
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
/**********GET ALL STUDENT DETAIL**********/
app.get('/api/getStudents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM students')];
            case 2:
                result = _a.sent();
                client.release();
                res.json(result.rows);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error fetching students:', error_3);
                res.status(500).send('Error fetching students');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/*******DELETE STUDENT DETAIL**********/
app.delete('/api/deleteStudent/:studentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, client, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _a.sent();
                return [4 /*yield*/, client.query('BEGIN')];
            case 3:
                _a.sent();
                return [4 /*yield*/, client.query('DELETE FROM students WHERE studentId = $1 RETURNING studentId', [studentId])];
            case 4:
                result = _a.sent();
                return [4 /*yield*/, client.query('COMMIT')];
            case 5:
                _a.sent();
                client.release();
                if (result.rows.length > 0) {
                    res.status(200).send('Student deleted successfully');
                }
                else {
                    res.status(404).send('Student not found');
                }
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                console.error('Error deleting student:', error_4);
                res.status(500).send('Error deleting student');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/*************GET STUDENT DETAIL USING STUDENTID************/
app.get('/api/getStudents/:studentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, client, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM students WHERE studentId = $1', [studentId])];
            case 3:
                result = _a.sent();
                client.release();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).send('Student not found');
                }
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error('Error fetching student:', error_5);
                res.status(500).send('Error fetching student');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/*******EDIT STUDENT DETAIL USING STUDENTID**********/
app.put('/api/updateStudent/:studentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, _a, name, classValue, email, client, result, error_6, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                studentId = req.params.studentId;
                _a = req.body, name = _a.name, classValue = _a.class, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 7, , 9]);
                return [4 /*yield*/, client.query('BEGIN')];
            case 4:
                _b.sent();
                return [4 /*yield*/, client.query('UPDATE students SET name = $1, class = $2, email = $3 WHERE studentId = $4 RETURNING *', [name, classValue, email, studentId])];
            case 5:
                result = _b.sent();
                return [4 /*yield*/, client.query('COMMIT')];
            case 6:
                _b.sent();
                client.release();
                if (result.rows.length > 0) {
                    res.status(200).send('Student updated successfully');
                }
                else {
                    res.status(404).send('Student not found');
                }
                return [3 /*break*/, 9];
            case 7:
                error_6 = _b.sent();
                return [4 /*yield*/, client.query('ROLLBACK')];
            case 8:
                _b.sent();
                client.release();
                console.error('Error updating student:', error_6);
                res.status(500).send('Error updating student');
                return [3 /*break*/, 9];
            case 9: return [3 /*break*/, 11];
            case 10:
                error_7 = _b.sent();
                console.error('Error connecting to the database:', error_7);
                res.status(500).send('Database connection error');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
