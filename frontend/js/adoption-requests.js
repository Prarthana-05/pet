// document.addEventListener('DOMContentLoaded', async () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     alert('Unauthorized: Please log in.');
//     window.location.href = 'login.html';
//     return;
//   }

//   try {
//     const response = await fetch('https://pet-ylqw.onrender.com/api/adoption-requests', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (response.status === 403) {
//       alert('Access denied: Admin only');
//       return;
//     }

//     const data = await response.json();
//     const container = document.getElementById('requestsContainer');
//     container.innerHTML = '';

//     data.forEach(req => {
//       const div = document.createElement('div');
//       div.classList.add('request-card');
//       div.innerHTML = `
//         <h3>${req.petId?.name || 'Unnamed Pet'}</h3>
//         <p><strong>User:</strong> ${req.userName}</p>
//         <p><strong>Email:</strong> ${req.userEmail}</p>
//         <p><strong>Status:</strong> ${req.status}</p>
//         <strong>Admin Response:</strong> ${req.adminResponse || 'No response yet'}
//       `;
//       container.appendChild(div);
//     });

//   } catch (err) {
//     console.error(err);
//     alert('Error loading adoption requests');
//   }
// });

// // Example JS
// document.getElementById('logoutBtn').addEventListener('click', function () {
//   // Clear tokens / session
//   localStorage.clear();
//   sessionStorage.clear();
//   // Redirect to login page
//   window.location.href = '/index.html';
// });


// Admin Adoption Requests JS
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Unauthorized: Please log in.');
    window.location.href = 'login.html';
    return;
  }

  const container = document.getElementById('requestsContainer');
  container.innerHTML = '<p>Loading adoption requests...</p>';

  try {
    const response = await fetch('https://pet-ylqw.onrender.com/api/adoption-requests', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch requests');

    const data = await response.json();
    container.innerHTML = '';

    data.forEach(req => {
      const div = document.createElement('div');
      div.classList.add('request-card');

      // Ensure _id is a string
      const requestId = req._id?.toString() || req.id;

      div.innerHTML = `
        <h3>${req.petId?.name || 'Unnamed Pet'}</h3>
        <p><strong>User:</strong> ${req.userName}</p>
        <p><strong>Email:</strong> ${req.userEmail}</p>
        <p><strong>Status:</strong> <span class="status-text">${req.status}</span></p>
        <p><strong>Admin Response:</strong> <span class="admin-response">${req.adminResponse || 'No response yet'}</span></p>
        <textarea class="admin-message" placeholder="Write a message to the user..."></textarea>
        <div class="admin-actions">
          <button class="approve-btn">Approve</button>
          <button class="reject-btn">Reject</button>
        </div>
      `;

      container.appendChild(div);

      // Button elements
      const approveBtn = div.querySelector('.approve-btn');
      const rejectBtn = div.querySelector('.reject-btn');
      const messageInput = div.querySelector('.admin-message');
      const adminResponseSpan = div.querySelector('.admin-response');
      const statusText = div.querySelector('.status-text');

      // Approve click
      approveBtn.addEventListener('click', async () => {
        if (!requestId) return alert('Request ID missing!');
        const msg = messageInput.value || 'Approved';
        const updated = await updateRequest(requestId, 'approved', msg);
        if (updated) {
          statusText.textContent = 'approved';
          adminResponseSpan.textContent = msg;
        }
      });

      // Reject click
      rejectBtn.addEventListener('click', async () => {
        if (!requestId) return alert('Request ID missing!');
        const msg = messageInput.value || 'Rejected';
        const updated = await updateRequest(requestId, 'rejected', msg);
        if (updated) {
          statusText.textContent = 'rejected';
          adminResponseSpan.textContent = msg;
        }
      });
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error loading adoption requests</p>';
  }
});

// Update request function
async function updateRequest(requestId, status, adminResponse) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`https://pet-ylqw.onrender.com/api/adoption-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, adminResponse })
    });

    if (!res.ok) {
      console.error('Failed to update:', res.status, await res.text());
      throw new Error('Failed to update request');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    alert('Error updating request');
    return null;
  }
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = 'index.html';
});
