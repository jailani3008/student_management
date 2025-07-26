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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const tbody = document.getElementById('attendanceTableBody');
    try {
        const response = yield fetch(`${API_BASE_URL}/api/getStudents`);
        const students = yield response.json();
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>
          <input type="radio" name="attendance-${student.studentid}" value="Present" class="present" required>
        </td>
        <td>
          <input type="radio" name="attendance-${student.studentid}" value="Absent" class="absent" required>
        </td>
      `;
            row.setAttribute('data-id', student.studentid);
            tbody.appendChild(row);
        });
    }
    catch (err) {
        console.error('Error fetching students:', err);
        alert('Could not load students.');
    }
    const form = document.getElementById('attendanceForm');
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const attendanceData = rows.map(row => {
            const studentId = row.getAttribute('data-id');
            const statusInput = row.querySelector('input[type="radio"]:checked');
            return {
                studentId,
                status: statusInput === null || statusInput === void 0 ? void 0 : statusInput.value
            };
        });
        try {
            const response = yield fetch(`${API_BASE_URL}/api/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ records: attendanceData })
            });
            if (response.ok) {
                alert('Attendance submitted successfully!');
                location.reload();
            }
            else {
                const error = yield response.text();
                alert(`Error submitting attendance:\n${error}`);
            }
        }
        catch (err) {
            console.error('Submission error:', err);
            alert('Failed to submit attendance');
        }
    }));
}));
