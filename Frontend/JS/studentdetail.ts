
if (!localStorage.getItem("isLoggedIn")) {
  window.location.replace("/HTML/login.html");
}

interface Student {
  studentid: string;
  name: string;
  class: string;
  email: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const studentTableBody = document.querySelector('#studentTable tbody') as HTMLTableSectionElement;

  if (!studentTableBody) {
    console.error("Student table tbody element not found!");
    return;
  }

  // Redirect to adddetails page with query on edit button
  function handleEditStudent(studentId: string): void {
    window.location.href = `adddetails.html?studentId=${studentId}`;
  }

  // Delete student with confirmation prompt
  async function handleDeleteStudent(studentId: string): Promise<void> {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/deleteStudent/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Student deleted successfully');
        await fetchStudents(); // Refresh student list
      } else {
        const errorText = await response.text();
        alert('Failed to delete student:\n' + errorText);
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Error deleting student.');
    }
  }

  // Render student rows with data-label for responsiveness
  function renderStudents(students: Student[]): void {
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
      const editBtn = row.querySelector('.edit-btn') as HTMLButtonElement | null;
      const deleteBtn = row.querySelector('.delete-btn') as HTMLButtonElement | null;

      if (editBtn) {
        editBtn.addEventListener('click', () => handleEditStudent(student.studentid));
      }
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeleteStudent(student.studentid));
      }
    });
  }

  // Fetch students from backend
  async function fetchStudents(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/getStudents`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const students: Student[] = await response.json();
      renderStudents(students);
    } catch (err) {
      console.error('Fetch Error:', err);
      alert('Error loading student data');
    }
  }

  // Fetch and render students on page load
  fetchStudents();
});
