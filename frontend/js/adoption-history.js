document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); // Get stored token
  const container = document.getElementById('requests-container');

  if (!container) {
    console.error('Missing #requests-container in HTML');
    return;
  }

  // Optional: show a temporary loading message
  container.innerHTML = '<p>Loading adoption requests...</p>';

  try {
    const res = await fetch('http://localhost:5000/api/adoption-requests/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch user requests');

    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = '<p>No adoption requests yet.</p>';
    } else {
      container.innerHTML = '';
      data.forEach(request => {
        console.log("Request data:", request);

       const dateStr = request.requestedAt
  ? new Date(request.requestedAt).toLocaleDateString()
  : 'Date not available';

        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
          <strong>Pet:</strong> ${request.petName}<br>
          <strong>Status:</strong> ${request.status}<br>
          <strong>Requested At:</strong> ${dateStr}
        `;
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error fetching requests:', err);
    container.innerHTML = '<p>Error loading adoption requests.</p>';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  // Clear token from localStorage
  localStorage.removeItem('token');

  // Redirect to home page
  window.location.href = 'index.html';
});
