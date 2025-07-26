const API_BASE = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const petId = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

document.getElementById('editBtn').addEventListener('click', () => {
  window.location.href = `edit-pet.html?id=${petId}`;
});

document.getElementById('deleteBtn').addEventListener('click', async () => {
  console.log('Delete button clicked');  // ✅ Test if this shows in console
  if (!confirm('Are you sure you want to delete this pet?')) return;

  try {
    const res = await fetch(`${API_BASE}/pets/${petId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to delete pet');

    alert('Pet deleted successfully!');
    window.location.href = 'home.html';  // Redirect to home or list page after delete

  } catch (err) {
    console.error('Error deleting pet:', err);
    alert('Delete failed.');
  }
});

async function loadPetDetails() {
  try {
    const res = await fetch(`${API_BASE}/pets/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch pet');
    const pet = await res.json();

    document.getElementById('petDetailsContainer').innerHTML = `
      <img src="http://localhost:5000/${pet.image}" alt="${pet.name}">
      <p><strong>Name:</strong> ${pet.name}</p>
      <p><strong>Breed:</strong> ${pet.breed}</p>
      <p><strong>Age:</strong> ${pet.age}</p>
      <p><strong>Owner:</strong> ${pet.ownerName}</p>
      <p><strong>Contact:</strong> ${pet.contact}</p>
      <p><strong>Status:</strong> ${pet.status}</p>
    `;
  } catch (err) {
    console.error(err);
  }
}

loadPetDetails();
