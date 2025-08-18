const API_BASE = 'https://pet-ylqw.onrender.com/api';
    const token = localStorage.getItem('token');
    const petId = new URLSearchParams(window.location.search).get('id');

    if (!token) window.location.href = 'index.html';

    const form = document.getElementById('editPetForm');

    async function loadPetData() {
      try {
        const res = await fetch(`${API_BASE}/pets/${petId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch pet');
        const pet = await res.json();

        form.innerHTML = `
          <input type="text" name="name" value="${pet.name}" required><br>
          <input type="text" name="breed" value="${pet.breed}" required><br>
          <input type="number" name="age" value="${pet.age}" required><br>
          <input type="text" name="ownerName" value="${pet.ownerName}" required><br>
          <input type="text" name="contact" value="${pet.contact}" required><br>
          <select name="status">
            <option ${pet.status === 'Available' ? 'selected' : ''}>Available</option>
            <option ${pet.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${pet.status === 'Adopted' ? 'selected' : ''}>Adopted</option>
          </select><br>
          <button type="submit">Save Changes</button>
        `;
      } catch (err) {
        console.error(err);
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const updatedPet = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(`${API_BASE}/pets/${petId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedPet)
        });

        if (!res.ok) throw new Error('Failed to update pet');

        alert('Pet updated successfully!');
        window.location.href = `pet-details.html?id=${petId}`;
      } catch (err) {
        console.error(err);
        alert('Update failed!');
      }
    });

    loadPetData();