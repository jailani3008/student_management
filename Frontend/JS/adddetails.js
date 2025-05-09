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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = new URLSearchParams(window.location.search);
    const studentIdParam = urlParams.get('studentId');
    const form = document.getElementById('studentForm');
    const studentIdInput = document.getElementById('studentId');
    const nameInput = document.getElementById('name');
    const classInput = document.getElementById('class');
    const emailInput = document.getElementById('email');
    // If editing, fetch and fill student details
    if (studentIdParam) {
        try {
            const response = yield fetch(`http://localhost:3000/api/getStudents/${studentIdParam}`);
            if (response.ok) {
                const student = yield response.json();
                studentIdInput.value = student.studentid;
                nameInput.value = student.name;
                classInput.value = student.class;
                emailInput.value = student.email;
                studentIdInput.disabled = true; // Make student ID read-only
            }
            else {
                alert('Student not found');
            }
        }
        catch (error) {
            console.error('Error fetching student details:', error);
            alert('Error loading student data');
        }
    }
    // Submit form
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const data = {
            studentId: studentIdInput.value,
            name: nameInput.value,
            class: classInput.value,
            email: emailInput.value
        };
        const apiUrl = studentIdParam
            ? `http://localhost:3000/api/students/${studentIdParam}` // PUT
            : 'http://localhost:3000/api/addStudent'; // POST
        const method = studentIdParam ? 'PUT' : 'POST';
        try {
            const response = yield fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert(`Student ${studentIdParam ? 'updated' : 'added'} successfully`);
                // ✅ Redirect after success
                window.location.href = '/Frontend/HTML/studentdetail.html';
            }
            else {
                const errorText = yield response.text();
                alert(`Failed to ${studentIdParam ? 'update' : 'add'} student:\n${errorText}`);
            }
        }
        catch (error) {
            console.error(`${method} Error:`, error);
            alert(`Error ${studentIdParam ? 'updating' : 'adding'} student`);
        }
    }));
}));
