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
var _this = this;
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var Pool = require('pg').Pool;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
var jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
var pool = new Pool({
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
app.post('/register', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, username, password, hashedPassword, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, pool.query('INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username', [username, hashedPassword])];
            case 3:
                result = _b.sent();
                res.status(201).json({
                    message: 'User registered successfully',
                    user: result.rows[0],
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                if (err_1.code === '23505') { // Unique violation - username exists
                    res.status(409).send('Username already exists');
                }
                else {
                    console.error('Register error:', err_1);
                    res.status(500).send('Error registering user');
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// **************** LOGIN ****************
app.post('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
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
                _b = !user;
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 3:
                _b = !(_c.sent());
                _c.label = 4;
            case 4:
                if (_b) {
                    return [2 /*return*/, res.status(401).send('Invalid credentials')];
                }
                token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
                res.json({ token: token });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _c.sent();
                console.error('Login error:', err_2);
                res.status(500).send('Error logging in');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// ********** ADD STUDENT DETAIL **********
app.post('/api/addStudent', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, studentId, name, classValue, email, client, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, studentId = _a.studentId, name = _a.name, classValue = _a.class, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 9, 10]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _b.sent();
                return [4 /*yield*/, client.query('BEGIN')];
            case 3:
                _b.sent();
                return [4 /*yield*/, client.query('INSERT INTO students(studentid, name, class, email) VALUES ($1, $2, $3, $4) RETURNING studentid', [studentId, name, classValue, email])];
            case 4:
                _b.sent();
                return [4 /*yield*/, client.query('COMMIT')];
            case 5:
                _b.sent();
                res.status(201).send('Student added successfully');
                return [3 /*break*/, 10];
            case 6:
                error_1 = _b.sent();
                if (!client) return [3 /*break*/, 8];
                return [4 /*yield*/, client.query('ROLLBACK')];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                console.error('Error adding student:', error_1);
                res.status(500).json({ error: 'Error adding student' });
                return [3 /*break*/, 10];
            case 9:
                if (client)
                    client.release();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
// ********** GET ALL STUDENT DETAIL **********
app.get('/api/getStudents', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var client, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 5]);
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM students')];
            case 2:
                result = _a.sent();
                res.json(result.rows);
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error('Error fetching students:', error_2);
                res.status(500).send('Error fetching students');
                return [3 /*break*/, 5];
            case 4:
                if (client)
                    client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
// ******** DELETE STUDENT DETAIL ********
app.delete('/api/deleteStudent/:studentId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var studentId, client, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 9, 10]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _a.sent();
                return [4 /*yield*/, client.query('BEGIN')];
            case 3:
                _a.sent();
                return [4 /*yield*/, client.query('DELETE FROM students WHERE studentid = $1 RETURNING studentid', [studentId])];
            case 4:
                result = _a.sent();
                return [4 /*yield*/, client.query('COMMIT')];
            case 5:
                _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).send('Student deleted successfully');
                }
                else {
                    res.status(404).send('Student not found');
                }
                return [3 /*break*/, 10];
            case 6:
                error_3 = _a.sent();
                if (!client) return [3 /*break*/, 8];
                return [4 /*yield*/, client.query('ROLLBACK')];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                console.error('Error deleting student:', error_3);
                res.status(500).send('Error deleting student: ' + error_3.message);
                return [3 /*break*/, 10];
            case 9:
                if (client)
                    client.release();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
// ***** GET STUDENT DETAIL BY ID *****
app.get('/api/getStudents/:studentId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var studentId, client, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, pool.connect()];
            case 2:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM students WHERE studentid = $1', [studentId])];
            case 3:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).send('Student not found');
                }
                return [3 /*break*/, 6];
            case 4:
                error_4 = _a.sent();
                console.error('Error fetching student:', error_4);
                res.status(500).send('Error fetching student');
                return [3 /*break*/, 6];
            case 5:
                if (client)
                    client.release();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
// ****** UPDATE STUDENT DETAIL ******
app.put('/api/students/:studentId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var studentId, _a, name, className, email, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                studentId = req.params.studentId;
                _a = req.body, name = _a.name, className = _a.class, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query("UPDATE students \n       SET name = $1, class = $2, email = $3 \n       WHERE studentid = $4 \n       RETURNING *", [name, className, email, studentId])];
            case 2:
                result = _b.sent();
                if (result.rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ message: 'Student not found' })];
                }
                res.json(result.rows[0]);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Error updating student:', error_5);
                res.status(500).json({ message: 'Server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ****** RECORD ATTENDANCE *******
app.post('/api/attendance', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var records, insertPromises, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                records = req.body.records;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                insertPromises = records.map(function (record) {
                    return pool.query('INSERT INTO attendance (studentid, status, attendance_date) VALUES ($1, $2, CURRENT_DATE)', [record.studentId, record.status]);
                });
                return [4 /*yield*/, Promise.all(insertPromises)];
            case 2:
                _a.sent();
                res.status(200).send('Attendance recorded');
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).send('Error recording attendance');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ****** ATTENDANCE COUNT FOR DASHBOARD ******
app.get('/attendance/count', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var totalStudentsResult, totalStudents, attendanceResult, _a, present, absent, percentage, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, pool.query('SELECT COUNT(*) FROM students')];
            case 1:
                totalStudentsResult = _b.sent();
                totalStudents = parseInt(totalStudentsResult.rows[0].count, 10);
                return [4 /*yield*/, pool.query("\n      SELECT \n          COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present,\n          COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent\n      FROM attendance\n      WHERE attendance_date = CURRENT_DATE\n    ")];
            case 2:
                attendanceResult = _b.sent();
                _a = attendanceResult.rows[0], present = _a.present, absent = _a.absent;
                percentage = totalStudents === 0 ? 0 : (present / totalStudents) * 100;
                res.json({
                    totalStudents: totalStudents,
                    present: present,
                    absent: absent,
                    percentage: percentage.toFixed(2),
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                console.error('Error calculating attendance counts:', err_4);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ******** LATEST ATTENDANCE SUMMARY *********
app.get("/latest-attendance-summary", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var latestTimestampResult, latestTimestamp, summaryResult, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, pool.query("\n      SELECT attendance_date \n      FROM attendance \n      ORDER BY attendance_date DESC \n      LIMIT 1\n    ")];
            case 1:
                latestTimestampResult = _b.sent();
                latestTimestamp = (_a = latestTimestampResult.rows[0]) === null || _a === void 0 ? void 0 : _a.attendance_date;
                if (!latestTimestamp) {
                    return [2 /*return*/, res.status(404).json({ message: "No attendance found" })];
                }
                return [4 /*yield*/, pool.query("SELECT status, COUNT(*) AS count\n       FROM attendance\n       WHERE attendance_date = $1\n       GROUP BY status", [latestTimestamp])];
            case 2:
                summaryResult = _b.sent();
                res.json({ date: latestTimestamp, summary: summaryResult.rows });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error("Error getting latest attendance summary:", error_6);
                res.status(500).send("Server error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ******** MARKSHEET ENTRY *********
app.post('/api/marks', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, record, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _i = 0, _a = req.body.records;
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                record = _a[_i];
                return [4 /*yield*/, pool.query("INSERT INTO marks (student_id, tamil, english, math, science, social, average) \n         VALUES ($1, $2, $3, $4, $5, $6, $7)", [record.studentId, record.tamil, record.english, record.math, record.science, record.social, record.average])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                res.status(200).send("Marks stored successfully.");
                return [3 /*break*/, 6];
            case 5:
                err_5 = _b.sent();
                console.error("Error inserting marks:", err_5);
                res.status(500).send("Error storing marks.");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
