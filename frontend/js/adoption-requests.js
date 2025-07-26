document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Unauthorized: Please log in.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/adoption-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      alert('Access denied: Admin only');
      return;
    }

    const data = await response.json();
    const container = document.getElementById('requestsContainer');
    container.innerHTML = '';

    data.forEach(req => {
      const div = document.createElement('div');
      div.classList.add('request-card');
      div.innerHTML = `
        <h3>${req.petId?.name || 'Unnamed Pet'}</h3>
        <p><strong>User:</strong> ${req.userName}</p>
        <p><strong>Email:</strong> ${req.userEmail}</p>
        <p><strong>Status:</strong> ${req.status}</p>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert('Error loading adoption requests');
  }
});

// Example JS
document.getElementById('logoutBtn').addEventListener('click', function () {
  // Clear tokens / session
  localStorage.clear();
  sessionStorage.clear();
  // Redirect to login page
  window.location.href = '/index.html';
});

