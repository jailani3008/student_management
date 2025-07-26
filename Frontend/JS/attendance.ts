import { API_BASE_URL } from '../config';

if (!localStorage.getItem("isLoggedIn")) {
  window.location.replace("/HTML/login.html");
}

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('attendanceTableBody')!;

  try {
    const response = await fetch(`${API_BASE_URL}/api/getStudents`);
    const students = await response.json();

    students.forEach((student: any, index: number) => {
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
  } catch (err) {
    console.error('Error fetching students:', err);
    alert('Could not load students.');
  }

  const form = document.getElementById('attendanceForm')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const attendanceData = rows.map(row => {
      const studentId = row.getAttribute('data-id');
      const statusInput = row.querySelector('input[type="radio"]:checked') as HTMLInputElement;
      return {
        studentId,
        status: statusInput?.value
      };
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: attendanceData })
      });

      if (response.ok) {
        alert('Attendance submitted successfully!');
        location.reload();
      } else {
        const error = await response.text();
        alert(`Error submitting attendance:\n${error}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit attendance');
    }
  });
});
