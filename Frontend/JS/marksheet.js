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
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/Frontend/HTML/login.html";
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var tbody, form, overallAverageEl, res, students;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tbody = document.getElementById('marksTableBody');
                form = document.getElementById('marksForm');
                overallAverageEl = document.getElementById('overallAverage');
                return [4 /*yield*/, fetch('http://localhost:3000/api/getStudents')];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 2:
                students = _a.sent();
                students.forEach(function (student) {
                    var row = document.createElement('tr');
                    row.innerHTML = "\n        <td>".concat(student.name, "</td>\n        <td><input type=\"number\" name=\"tamil-").concat(student.studentid, "\" required></td>\n        <td><input type=\"number\" name=\"english-").concat(student.studentid, "\" required></td>\n        <td><input type=\"number\" name=\"math-").concat(student.studentid, "\" required></td>\n        <td><input type=\"number\" name=\"science-").concat(student.studentid, "\" required></td>\n        <td><input type=\"number\" name=\"social-").concat(student.studentid, "\" required></td>\n        <td class=\"avg-cell\">0</td>\n      ");
                    row.setAttribute('data-id', student.studentid);
                    tbody.appendChild(row);
                });
                form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var rows, marksData, totalAverage, _loop_1, _i, rows_1, row, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                e.preventDefault();
                                rows = Array.from(tbody.querySelectorAll('tr'));
                                marksData = [];
                                totalAverage = 0;
                                _loop_1 = function (row) {
                                    var studentId = row.getAttribute('data-id');
                                    var marks = ['tamil', 'english', 'math', 'science', 'social'].map(function (subject) {
                                        return parseInt(row.querySelector("input[name=\"".concat(subject, "-").concat(studentId, "\"]")).value);
                                    });
                                    var average = marks.reduce(function (a, b) { return a + b; }) / marks.length;
                                    totalAverage += average;
                                    marksData.push({ studentId: studentId, tamil: marks[0], english: marks[1], math: marks[2], science: marks[3], social: marks[4], average: average });
                                    var avgCell = row.querySelector('.avg-cell');
                                    avgCell.textContent = average.toFixed(2); // show individual average
                                };
                                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                    row = rows_1[_i];
                                    _loop_1(row);
                                }
                                return [4 /*yield*/, fetch('http://localhost:3000/api/marks', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ records: marksData }),
                                    })];
                            case 1:
                                response = _a.sent();
                                if (response.ok) {
                                    overallAverageEl.textContent = "Overall Average: ".concat((totalAverage / marksData.length).toFixed(2));
                                    alert("Marks submitted successfully!");
                                }
                                else {
                                    alert("Failed to submit marks.");
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
