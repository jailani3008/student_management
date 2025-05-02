document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentIdParam = urlParams.get('studentId');
  
    const form = document.getElementById('studentForm') as HTMLFormElement;
    const studentIdInput = document.getElementById('studentId') as HTMLInputElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const classInput = document.getElementById('class') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
  
    // If editing, fetch and fill student details
    if (studentIdParam) {
      try {
        const response = await fetch(`http://localhost:3000/api/getStudents/${studentIdParam}`);
        if (response.ok) {
          const student = await response.json();
  
          studentIdInput.value = student.studentid;
          nameInput.value = student.name;
          classInput.value = student.class;
          emailInput.value = student.email;
  
          studentIdInput.disabled = true; // Make student ID read-only
        } else {
          alert('Student not found');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        alert('Error loading student data');
      }
    }
  
    // Submit form
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        studentId: studentIdInput.value,
        name: nameInput.value,
        class: classInput.value,
        email: emailInput.value
      };
  
      const apiUrl = studentIdParam
        ? `http://localhost:3000/api/students/${studentIdParam}` // PUT
        : 'http://localhost:3000/api/addStudent';                // POST
  
      const method = studentIdParam ? 'PUT' : 'POST';
  
      try {
        const response = await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
          alert(`Student ${studentIdParam ? 'updated' : 'added'} successfully`);
  
          // ✅ Redirect after success
          window.location.href = '/Frontend/HTML/studentdetail.html';
        } else {
          const errorText = await response.text();
          alert(`Failed to ${studentIdParam ? 'update' : 'add'} student:\n${errorText}`);
        }
      } catch (error) {
        console.error(`${method} Error:`, error);
        alert(`Error ${studentIdParam ? 'updating' : 'adding'} student`);
      }
    });
  });
  