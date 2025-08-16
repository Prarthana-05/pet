const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

const form = document.getElementById('addPetForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch('https://pet-ylqw.onrender.com/api/pets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to add pet');
    }

    // Store success message for home page
    sessionStorage.setItem('petAddedSuccess', 'true');
    
    // Redirect to home page
    window.location.href = 'home.html';

  } catch (err) {
    console.error('Error:', err);
    alert(err.message || 'Something went wrong');
  }
});