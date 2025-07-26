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
var config_1 = require("../config");
document.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
    var urlParams, studentIdParam, form, studentIdInput, nameInput, classInput, emailInput, response, student, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urlParams = new URLSearchParams(window.location.search);
                studentIdParam = urlParams.get('studentId');
                form = document.getElementById('studentForm');
                studentIdInput = document.getElementById('studentId');
                nameInput = document.getElementById('name');
                classInput = document.getElementById('class');
                emailInput = document.getElementById('email');
                if (!form || !studentIdInput || !nameInput || !classInput || !emailInput)
                    return [2 /*return*/];
                if (!studentIdParam) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, fetch("".concat(config_1.API_BASE_URL, "/api/getStudents/").concat(studentIdParam))];
            case 2:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.json()];
            case 3:
                student = _a.sent();
                studentIdInput.value = student.studentid;
                nameInput.value = student.name;
                classInput.value = student.class;
                emailInput.value = student.email;
                studentIdInput.disabled = true;
                return [3 /*break*/, 5];
            case 4:
                alert('Student not found');
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                alert('Error loading student data');
                return [3 /*break*/, 7];
            case 7:
                form.addEventListener('submit', function (e) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, apiUrl, method, response, errorText, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                e.preventDefault();
                                data = {
                                    studentId: studentIdInput.value,
                                    name: nameInput.value,
                                    class: classInput.value,
                                    email: emailInput.value
                                };
                                apiUrl = studentIdParam
                                    ? "".concat(config_1.API_BASE_URL, "/api/students/").concat(studentIdParam)
                                    : "".concat(config_1.API_BASE_URL, "/api/addStudent");
                                method = studentIdParam ? 'PUT' : 'POST';
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, , 7]);
                                return [4 /*yield*/, fetch(apiUrl, {
                                        method: method,
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(data)
                                    })];
                            case 2:
                                response = _b.sent();
                                if (!response.ok) return [3 /*break*/, 3];
                                alert("Student ".concat(studentIdParam ? 'updated' : 'added', " successfully"));
                                window.location.href = 'studentdetail.html';
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, response.text()];
                            case 4:
                                errorText = _b.sent();
                                alert("Failed to ".concat(studentIdParam ? 'update' : 'add', " student:\n").concat(errorText));
                                _b.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                _a = _b.sent();
                                alert("Error ".concat(studentIdParam ? 'updating' : 'adding', " student"));
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
