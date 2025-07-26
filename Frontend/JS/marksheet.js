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
    window.location.href = "/HTML/login.html";
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const tbody = document.getElementById('marksTableBody');
    const form = document.getElementById('marksForm');
    const overallAverageEl = document.getElementById('overallAverage');
    // FETCH from local backend!
    const res = yield fetch(`${API_BASE_URL}/api/getStudents`);
    const students = yield res.json();
    students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${student.name}</td>
      <td><input type="number" name="tamil-${student.studentid}" required></td>
      <td><input type="number" name="english-${student.studentid}" required></td>
      <td><input type="number" name="math-${student.studentid}" required></td>
      <td><input type="number" name="science-${student.studentid}" required></td>
      <td><input type="number" name="social-${student.studentid}" required></td>
      <td class="avg-cell">0</td>
    `;
        row.setAttribute('data-id', student.studentid);
        tbody.appendChild(row);
    });
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const marksData = [];
        let totalAverage = 0;
        for (const row of rows) {
            const studentId = row.getAttribute('data-id');
            const marks = ['tamil', 'english', 'math', 'science', 'social'].map(subject => parseInt(row.querySelector(`input[name="${subject}-${studentId}"]`).value));
            const average = marks.reduce((a, b) => a + b) / marks.length;
            totalAverage += average;
            marksData.push({
                studentId,
                tamil: marks[0],
                english: marks[1],
                math: marks[2],
                science: marks[3],
                social: marks[4],
                average
            });
            const avgCell = row.querySelector('.avg-cell');
            avgCell.textContent = average.toFixed(2); // show individual average
        }
        // POST to local backend!
        const response = yield fetch(`${API_BASE_URL}/api/marks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: marksData }),
        });
        if (response.ok) {
            overallAverageEl.textContent = `Overall Average: ${(totalAverage / marksData.length).toFixed(2)}`;
            alert("Marks submitted successfully!");
        }
        else {
            alert("Failed to submit marks.");
        }
    }));
}));
