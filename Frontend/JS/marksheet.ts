if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/Frontend/HTML/login.html";
  }
  
document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('marksTableBody')!;
    const form = document.getElementById('marksForm')!;
    const overallAverageEl = document.getElementById('overallAverage')!;
  
    const res = await fetch('http://localhost:3000/api/getStudents');
    const students = await res.json();
  
    students.forEach((student: any) => {
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
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const marksData = [];
      let totalAverage = 0;
  
      for (const row of rows) {
        const studentId = row.getAttribute('data-id')!;
        const marks = ['tamil', 'english', 'math', 'science', 'social'].map(subject =>
          parseInt((row.querySelector(`input[name="${subject}-${studentId}"]`) as HTMLInputElement).value)
        );
        const average = marks.reduce((a, b) => a + b) / marks.length;
        totalAverage += average;
  
        marksData.push({ studentId, tamil: marks[0], english: marks[1], math: marks[2], science: marks[3], social: marks[4], average });
        const avgCell = row.querySelector('.avg-cell') as HTMLTableCellElement;
        avgCell.textContent = average.toFixed(2); // show individual average

      }
  
      const response = await fetch('http://localhost:3000/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: marksData }),
      });
  
      if (response.ok) {
        overallAverageEl.textContent = `Overall Average: ${(totalAverage / marksData.length).toFixed(2)}`;
        alert("Marks submitted successfully!");
      } else {
        alert("Failed to submit marks.");
      }
    });
  });
  