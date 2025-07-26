const token = localStorage.getItem('token');

// Redirect to login if not authenticated
if (!token) {
  window.location.href = 'index.html';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// Global variables
let selectedPetId = null;

// Load and display available pets
async function loadAvailablePets() {
  try {
    const res = await fetch('http://localhost:5000/api/pets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to load pets');
    }

    const pets = await res.json();

    // Filter to show only available pets
    const availablePets = pets.filter(pet => pet.status === 'Available');

    displayPets(availablePets);

  } catch (err) {
    console.error('Error loading pets:', err);
    document.getElementById('petGrid').innerHTML = '<p>Failed to load pets. Please try again later.</p>';
  }
}

// Display pets on the page
function displayPets(pets) {
  const petGrid = document.getElementById('petGrid');

  if (!petGrid) {
    console.error('Pet grid container not found');
    return;
  }

  if (pets.length === 0) {
    petGrid.innerHTML = '<p>No pets available for adoption at the moment.</p>';
    return;
  }

  petGrid.innerHTML = pets.map(pet => `
    <div class="pet-card">
      <img src="http://localhost:5000/${pet.image}" alt="${pet.name}" onerror="this.src='images/default-pet.jpg'">
      <div class="pet-info">
        <h3>${pet.name}</h3>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Age:</strong> ${pet.age} years</p>
        <p><strong>Owner:</strong> ${pet.ownerName}</p>
        <p><strong>Contact:</strong> ${pet.contact}</p>
        <button class="request-btn" data-petid="${pet._id}" data-name="${pet.name}">Request Adoption</button>
      </div>
    </div>
  `).join('');

  // Attach event listeners after rendering
  document.querySelectorAll('.request-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPetId = btn.getAttribute('data-petid');
      document.getElementById('adoptionPetName').textContent = btn.getAttribute('data-name');
      document.getElementById('adoptionModal').classList.remove('hidden');
    });
  });
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('adoptionModal').classList.add('hidden');
});

// Submit adoption request
document.getElementById('submitAdoptionRequest').addEventListener('click', async () => {
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const address = document.getElementById('userAddress').value.trim();
  const message = document.getElementById('userMessage').value.trim();

  if (!name || !phone || !address || !message) {
    return alert('Please fill in all fields.');
  }

  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const res = await fetch('http://localhost:5000/api/adoption-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user._id,
    petId: selectedPetId,
    userEmail: user.email,
    userName: name,
    phone,
    address,
    message
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Adoption request submitted successfully.');
      document.getElementById('adoptionModal').classList.add('hidden');

      // Reset form
      document.getElementById('userName').value = '';
      document.getElementById('userPhone').value = '';
      document.getElementById('userAddress').value = '';
      document.getElementById('userMessage').value = '';
    } else {
      alert(data.message || 'Failed to submit request.');
    }

  } catch (err) {
    console.error('Error submitting request:', err);
    alert('Something went wrong. Please try again later.');
  }
});

// Load pets when page loads
document.addEventListener('DOMContentLoaded', loadAvailablePets);
