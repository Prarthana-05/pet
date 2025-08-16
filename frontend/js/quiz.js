const API_BASE = 'https://pet-ylqw.onrender.com';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// 🔄 Dynamic Navbar Rendering Based on Role
const navbar = document.querySelector('.nav-links');
if (navbar) {
  navbar.innerHTML = '';

  if (role === 'admin') {
    navbar.innerHTML = `
      <a href="home.html">Home</a>
    <a href="add-pet.html">Add Pet</a>
    <a href="quiz.html">Pet Compatibility Quiz</a>
    <a href="vet-services.html">Nearby Vet & Services</a>
    <a href="adoption-requests.html">Adoption Requests</a>
    `;
  } else {
    navbar.innerHTML = `
      <a href="user-dashboard.html">Home</a>
      <a href="quiz.html">Pet Compatibility Quiz</a>
      <a href="vet-services.html">Nearby Vet & Services</a>
      <a href="adoption-history.html">Adoption Status</a>
    `;
  }

  // 👋 Add logout button
 
}

// 🔒 Logout Logic
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = 'index.html';
    });
  }
});

// 🐾 Quiz Submission Handler
document.getElementById('quizForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(this).entries());

  try {
    const res = await fetch(`${API_BASE}/api/pets/quiz-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error('No matching pets found');

    const pets = await res.json();
    displayPets(pets);

  } catch (err) {
    document.getElementById('quizResultsContainer').innerHTML = '<p>No matching pets found.</p>';
  }
});

// 🖼️ Quiz Results Renderer
function displayPets(pets) {
  const container = document.getElementById('quizResultsContainer');
  container.innerHTML = '';

  pets.forEach(pet => {
    container.innerHTML += `
      <div class="pet-card">
        <img src="https://pet-ylqw.onrender.com/${pet.image}" alt="${pet.name}">
        <p><strong>${pet.name}</strong> (${pet.breed})</p>
        <p>Age: ${pet.age}</p>
        <p>Status: ${pet.status}</p>
      </div>
    `;
  });
}
