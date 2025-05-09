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
if (!localStorage.getItem("isLoggedIn")) {
    window.location.replace("/Frontend/HTML/login.html");
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const studentTableBody = document.querySelector('#studentTable tbody');
    const handleEditStudent = (studentId) => {
        window.location.href = `adddetails.html?studentId=${studentId}`;
    };
    const handleDeleteStudent = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const response = yield fetch(`http://localhost:3000/api/deleteStudent/${studentId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Student deleted successfully');
                    yield fetchStudents();
                }
                else {
                    const errorText = yield response.text();
                    alert('Failed to delete student:\n' + errorText);
                }
            }
            catch (error) {
                console.error('Delete Error:', error);
                alert('Error deleting student');
            }
        }
    });
    const renderStudents = (students) => {
        studentTableBody.innerHTML = '';
        students.forEach((student, index) => {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student.studentid}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.email}</td>
          <td>
            <button class="edit-btn" data-id="${student.studentid}">Edit</button>
            <button class="delete-btn" data-id="${student.studentid}">Delete</button>
          </td>
        `;
            studentTableBody.appendChild(row);
            (_a = row.querySelector('.edit-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                handleEditStudent(student.studentid);
            });
            (_b = row.querySelector('.delete-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                handleDeleteStudent(student.studentid);
            });
        });
    };
    const fetchStudents = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/api/getStudents');
            if (response.ok) {
                const students = yield response.json();
                renderStudents(students);
            }
            else {
                throw new Error('Failed to fetch students');
            }
        }
        catch (error) {
            console.error('Fetch Error:', error);
            alert('Error loading student data');
        }
    });
    yield fetchStudents();
}));
