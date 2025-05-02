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
    var tbody, response, students, err_1, form;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tbody = document.getElementById('attendanceTableBody');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch('http://localhost:3000/api/getStudents')];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                students = _a.sent();
                students.forEach(function (student, index) {
                    var row = document.createElement('tr');
                    row.innerHTML = "\n          <td>".concat(index + 1, "</td>\n          <td>").concat(student.name, "</td>\n          <td>\n            <input type=\"radio\" name=\"attendance-").concat(student.studentid, "\" value=\"Present\" class=\"present\" required>\n          </td>\n          <td>\n            <input type=\"radio\" name=\"attendance-").concat(student.studentid, "\" value=\"Absent\" class=\"absent\" required>\n          </td>\n        ");
                    row.setAttribute('data-id', student.studentid);
                    tbody.appendChild(row);
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error('Error fetching students:', err_1);
                alert('Could not load students.');
                return [3 /*break*/, 5];
            case 5:
                form = document.getElementById('attendanceForm');
                form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var rows, attendanceData, response, error, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                e.preventDefault();
                                rows = Array.from(tbody.querySelectorAll('tr'));
                                attendanceData = rows.map(function (row) {
                                    var studentId = row.getAttribute('data-id');
                                    var statusInput = row.querySelector('input[type="radio"]:checked');
                                    return {
                                        studentId: studentId,
                                        status: statusInput === null || statusInput === void 0 ? void 0 : statusInput.value
                                    };
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 6, , 7]);
                                return [4 /*yield*/, fetch('http://localhost:3000/api/attendance', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ records: attendanceData })
                                    })];
                            case 2:
                                response = _a.sent();
                                if (!response.ok) return [3 /*break*/, 3];
                                alert('Attendance submitted successfully!');
                                location.reload();
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, response.text()];
                            case 4:
                                error = _a.sent();
                                alert("Error submitting attendance:\n".concat(error));
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                err_2 = _a.sent();
                                console.error('Submission error:', err_2);
                                alert('Failed to submit attendance');
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
