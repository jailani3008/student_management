
// Redirect to login page if not logged in (localStorage flag)
if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "/HTML/login.html";
}

interface MarkRecord {
  studentId: string;
  tamil: number;
  english: number;
  math: number;
  science: number;
  social: number;
  average: number;
}

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('marksTableBody') as HTMLTableSectionElement;
  const form = document.getElementById('marksForm') as HTMLFormElement;
  const overallAverageEl = document.getElementById('overallAverage') as HTMLElement;

  // Fetch students from backend
  try {
    const res = await fetch(`${API_BASE_URL}/api/getStudents`);
    if (!res.ok) throw new Error('Failed to fetch students');
    const students = await res.json();

    // Build table rows dynamically with data-label for responsiveness
    students.forEach((student: any) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Name">${student.name}</td>
        <td data-label="Tamil"><input type="number" name="tamil-${student.studentid}" min="0" max="100" required></td>
        <td data-label="English"><input type="number" name="english-${student.studentid}" min="0" max="100" required></td>
        <td data-label="Math"><input type="number" name="math-${student.studentid}" min="0" max="100" required></td>
        <td data-label="Science"><input type="number" name="science-${student.studentid}" min="0" max="100" required></td>
        <td data-label="Social"><input type="number" name="social-${student.studentid}" min="0" max="100" required></td>
        <td data-label="Average" class="avg-cell">0</td>
      `;
      row.setAttribute('data-id', student.studentid);
      tbody.appendChild(row);
    });
  } catch (e) {
    alert("Error loading student data. Please try again later.");
    console.error(e);
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const marksData: MarkRecord[] = [];
    let totalAverage = 0;

    for (const row of rows) {
      const studentId = row.getAttribute('data-id')!;
      const marks = ['tamil', 'english', 'math', 'science', 'social'].map(subject => {
        const input = row.querySelector(`input[name="${subject}-${studentId}"]`) as HTMLInputElement;
        return Number(input.value);
      });

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

      // Update average cell text
      const avgCell = row.querySelector('.avg-cell') as HTMLTableCellElement;
      avgCell.textContent = average.toFixed(2);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: marksData }),
      });

      if (response.ok) {
        overallAverageEl.textContent = `Overall Average: ${(totalAverage / marksData.length).toFixed(2)}`;
        alert("Marks submitted successfully!");
      } else {
        const errorText = await response.text();
        alert(`Failed to submit marks: ${errorText}`);
      }
    } catch {
      alert("Failed to submit marks. Please check your connection and try again.");
    }
  });
});
