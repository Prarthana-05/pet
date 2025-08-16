const API_BASE = 'https://pet-ylqw.onrender.com';
const token = localStorage.getItem('token');

if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

const petGrid = document.getElementById('petGrid');

async function fetchPets() {
  try {
    const res = await fetch(`${API_BASE}/api/pets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch pets');

    const pets = await res.json();

    pets.forEach(pet => {
      const card = document.createElement('div');
      card.className = 'pet-card';

      card.innerHTML = `
        <img src="https://pet-ylqw.onrender.com/${pet.image}" alt="${pet.name}" style="cursor:pointer;">
        <p><strong>${pet.name}</strong></p>
      `;

      card.querySelector('img').addEventListener('click', () => {
        window.location.href = `pet-details.html?id=${pet._id}`;
      });

      petGrid.appendChild(card);
    });

  } catch (err) {
    console.error('Error fetching pets:', err);
    alert('Failed to load pets.');
  }
}

fetchPets();
