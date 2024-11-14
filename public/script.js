const form = document.getElementById('assignment-form');
const submissionStatus = document.getElementById('submission-status');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const studentName = document.getElementById('student-name').value;
    const departmentName = document.getElementById('department-name').value;
    const matricNumber = document.getElementById('matric-number').value;
    const level = document.getElementById('level').value;
    const fileInput = document.getElementById('assignment-file');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('studentName', studentName);
    formData.append('departmentName', departmentName);
    formData.append('matricNumber', matricNumber);
    formData.append('level', level);
    formData.append('assignment', file);

    fetch('/submit-assignment', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            submissionStatus.innerHTML = '<p class="text-success">Assignment submitted successfully!</p>';
        } else {
            submissionStatus.innerHTML = '<p class="text-danger">Error submitting assignment: ' + data.message + '</p>';
        }
    })
    .catch((error) => {
        submissionStatus.innerHTML = '<p class="text-danger">Error submitting assignment: ' + error.message + '</p>';
    });
});

// View feedback code
// View feedback code