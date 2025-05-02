if (!localStorage.getItem("isLoggedIn")) {
  window.location.replace("/Frontend/HTML/login.html");
}

interface Student {
    studentid: string;
    name: string;
    class: string;
    email: string;
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const studentTableBody = document.querySelector('#studentTable tbody') as HTMLTableSectionElement;
  
    const handleEditStudent = (studentId: string): void => {
      window.location.href = `adddetails.html?studentId=${studentId}`;
    };
  
    const handleDeleteStudent = async (studentId: string): Promise<void> => {
      if (confirm('Are you sure you want to delete this student?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/deleteStudent/${studentId}`, {
            method: 'DELETE'
          });
  
          if (response.ok) {
            alert('Student deleted successfully');
            await fetchStudents();
          } else {
            const errorText = await response.text();
            alert('Failed to delete student:\n' + errorText);
          }
        } catch (error) {
          console.error('Delete Error:', error);
          alert('Error deleting student');
        }
      }
    };
  
    const renderStudents = (students: Student[]): void => {
      studentTableBody.innerHTML = '';
  
      students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student.studentid}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.email}</td>
          <td>
            <button class="edit-btn" data-id="${student.studentid}">Edit</button>
            <button class="delete-btn" data-id="${student.studentid}">Delete</button>
          </td>
        `;
        studentTableBody.appendChild(row);
  
        row.querySelector('.edit-btn')?.addEventListener('click', () => {
          handleEditStudent(student.studentid);
        });
  
        row.querySelector('.delete-btn')?.addEventListener('click', () => {
          handleDeleteStudent(student.studentid);
        });
      });
    };
  
    const fetchStudents = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:3000/api/getStudents');
        if (response.ok) {
          const students = await response.json();
          renderStudents(students);
        } else {
          throw new Error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        alert('Error loading student data');
      }
    };
  
    await fetchStudents();
    
  });
  