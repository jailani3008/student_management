
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const studentIdParam = urlParams.get('studentId');
  

  const form = document.getElementById('studentForm') as HTMLFormElement | null;
  const studentIdInput = document.getElementById('studentId') as HTMLInputElement | null;
  const nameInput = document.getElementById('name') as HTMLInputElement | null;
  const classInput = document.getElementById('class') as HTMLInputElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;

  if (!form || !studentIdInput || !nameInput || !classInput || !emailInput) return;

  if (studentIdParam) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/getStudents/${studentIdParam}`);
      if (response.ok) {
        const student = await response.json();
        studentIdInput.value = student.studentid;
        nameInput.value = student.name;
        classInput.value = student.class;
        emailInput.value = student.email;
        studentIdInput.disabled = true;
      } else {
        alert('Student not found');
      }
    } catch (error) {
      alert('Error loading student data');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      studentId: studentIdInput.value,
      name: nameInput.value,
      class: classInput.value,
      email: emailInput.value
    };
    const apiUrl = studentIdParam
      ? `${API_BASE_URL}/api/students/${studentIdParam}`
      : `${API_BASE_URL}/api/addStudent`;
    const method = studentIdParam ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        alert(`Student ${studentIdParam ? 'updated' : 'added'} successfully`);
        window.location.href = 'studentdetail.html';
      } else {
        const errorText = await response.text();
        alert(`Failed to ${studentIdParam ? 'update' : 'add'} student:\n${errorText}`);
      }
    } catch {
      alert(`Error ${studentIdParam ? 'updating' : 'adding'} student`);
    }
  });
});
