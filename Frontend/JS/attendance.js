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
    // Element references (with type safety)
    const tbody = document.getElementById('attendanceTableBody');
    const form = document.getElementById('attendanceForm');
    if (!tbody || !form) {
        console.error("Attendance table body or form not found in the DOM.");
        return;
    }
    // Fetch student list and populate the table
    function fetchStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_BASE_URL}/api/getStudents`);
                if (!response.ok)
                    throw new Error(`Failed to fetch students: ${response.statusText}`);
                const students = yield response.json();
                students.forEach((student, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td data-label="S.NO">${index + 1}</td>
          <td data-label="Student Name">${student.name}</td>
          <td data-label="Present">
            <input type="radio" name="attendance-${student.studentid}" value="Present" class="present" required>
          </td>
          <td data-label="Absent">
            <input type="radio" name="attendance-${student.studentid}" value="Absent" class="absent" required>
          </td>
        `;
                    row.setAttribute('data-id', student.studentid);
                    tbody.appendChild(row);
                });
            }
            catch (error) {
                console.error('Error fetching students:', error);
                alert('Could not load students.');
            }
        });
    }
    // Fill the table at page load
    fetchStudents();
    // Handle form submission
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const attendanceData = rows.map(row => {
            const studentId = row.getAttribute('data-id');
            const statusInput = row.querySelector('input[type="radio"]:checked');
            return {
                studentId,
                status: statusInput ? statusInput.value : null
            };
        });
        try {
            const response = yield fetch(`${API_BASE_URL}/api/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ records: attendanceData })
            });
            if (response.ok) {
                alert('Attendance submitted successfully!');
                location.reload();
            }
            else {
                const errorText = yield response.text();
                alert(`Error submitting attendance:\n${errorText}`);
            }
        }
        catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit attendance');
        }
    }));
});
