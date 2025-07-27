
if (!localStorage.getItem("isLoggedIn")) {
  window.location.replace("/HTML/login.html");
}

document.addEventListener('DOMContentLoaded', () => {
  // Element references (with type safety)
  const tbody = document.getElementById('attendanceTableBody') as HTMLTableSectionElement;
  const form = document.getElementById('attendanceForm') as HTMLFormElement;

  if (!tbody || !form) {
    console.error("Attendance table body or form not found in the DOM.");
    return;
  }

  // Types
  interface Student {
    studentid: string;
    name: string;
  }

  interface AttendanceRecord {
    studentId: string | null;
    status: string | null;
  }

  // Fetch student list and populate the table
  async function fetchStudents(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/getStudents`);
      if (!response.ok) throw new Error(`Failed to fetch students: ${response.statusText}`);
      const students: Student[] = await response.json();

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
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Could not load students.');
    }
  }

  // Fill the table at page load
  fetchStudents();

  // Handle form submission
  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const attendanceData: AttendanceRecord[] = rows.map(row => {
      const studentId = row.getAttribute('data-id');
      const statusInput = row.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;
      return {
        studentId,
        status: statusInput ? statusInput.value : null
      };
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: attendanceData })
      });

      if (response.ok) {
        alert('Attendance submitted successfully!');
        location.reload();
      } else {
        const errorText = await response.text();
        alert(`Error submitting attendance:\n${errorText}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit attendance');
    }
  });
});
