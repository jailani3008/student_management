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
    window.location.replace("/HTML/login.html");
}
document.addEventListener('DOMContentLoaded', () => {
    const studentTableBody = document.querySelector('#studentTable tbody');
    if (!studentTableBody) {
        console.error("Student table tbody element not found!");
        return;
    }
    // Redirect to adddetails page with query on edit button
    function handleEditStudent(studentId) {
        window.location.href = `adddetails.html?studentId=${studentId}`;
    }
    // Delete student with confirmation prompt
    function handleDeleteStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmDelete = confirm("Are you sure you want to delete this student?");
            if (!confirmDelete)
                return;
            try {
                const response = yield fetch(`${API_BASE_URL}/api/deleteStudent/${studentId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Student deleted successfully');
                    yield fetchStudents(); // Refresh student list
                }
                else {
                    const errorText = yield response.text();
                    alert('Failed to delete student:\n' + errorText);
                }
            }
            catch (err) {
                console.error('Delete Error:', err);
                alert('Error deleting student.');
            }
        });
    }
    // Render student rows with data-label for responsiveness
    function renderStudents(students) {
        studentTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td data-label="S.No">${index + 1}</td>
        <td data-label="Student ID">${student.studentid}</td>
        <td data-label="Name">${student.name}</td>
        <td data-label="Class">${student.class}</td>
        <td data-label="Email">${student.email}</td>
        <td data-label="Actions">
          <button class="edit-btn" data-id="${student.studentid}">Edit</button>
          <button class="delete-btn" data-id="${student.studentid}">Delete</button>
        </td>
      `;
            studentTableBody.appendChild(row);
            // Add event listeners for edit/delete buttons
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => handleEditStudent(student.studentid));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => handleDeleteStudent(student.studentid));
            }
        });
    }
    // Fetch students from backend
    function fetchStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_BASE_URL}/api/getStudents`);
                if (!response.ok)
                    throw new Error('Failed to fetch students');
                const students = yield response.json();
                renderStudents(students);
            }
            catch (err) {
                console.error('Fetch Error:', err);
                alert('Error loading student data');
            }
        });
    }
    // Fetch and render students on page load
    fetchStudents();
});
