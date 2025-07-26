// 🌐 Role-Based Navbar Setup
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

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

  // 🔐 Logout Button
 
}

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

let map;
let currentRouteLayer;

document.getElementById('findVetBtn').addEventListener('click', async () => {
  const location = document.getElementById('locationInput').value.trim();
  if (!location) return alert('Please enter a location.');

  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const geoData = await geoRes.json();
    if (!geoData.length) return alert('Location not found.');

    const userLat = parseFloat(geoData[0].lat);
    const userLon = parseFloat(geoData[0].lon);

    const vetRes = await fetch(`http://localhost:5000/api/vetservices/nearby?lat=${userLat}&lng=${userLon}`);
    const vets = await vetRes.json();

    const resultContainer = document.getElementById('vetResults');
    resultContainer.innerHTML = '';

    if (!vets.length) {
      resultContainer.innerHTML = '<p>No services found near you.</p>';
      return;
    }

    if (window.vetMap) {
      window.vetMap.remove();
    }

    map = L.map('map').setView([userLat, userLon], 12);
    window.vetMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([userLat, userLon]).addTo(map).bindPopup('You are here').openPopup();

    vets.forEach((vet, index) => {
      resultContainer.innerHTML += `
        <div class="pet-card" data-lat="${vet.location.coordinates[1]}" data-lon="${vet.location.coordinates[0]}">
          <p><strong>${vet.name}</strong></p>
          <p>Type: ${vet.type}</p>
          <p>Address: ${vet.address}</p>
          <p>Contact: ${vet.contact}</p>
        </div>
      `;

      L.marker([vet.location.coordinates[1], vet.location.coordinates[0]])
        .addTo(map)
        .bindPopup(`<strong>${vet.name}</strong>`);
    });

    // 🟢 Route Drawer on Card Click
    document.querySelectorAll('.pet-card').forEach(card => {
      card.addEventListener('click', async () => {
        const vetLat = parseFloat(card.getAttribute('data-lat'));
        const vetLon = parseFloat(card.getAttribute('data-lon'));

        if (currentRouteLayer) {
          map.removeLayer(currentRouteLayer);
        }

        currentRouteLayer = await drawORSRoute(userLat, userLon, vetLat, vetLon, map);
      });
    });

  } catch (err) {
    console.error(err);
    alert('Error fetching services.');
  }
});

async function drawORSRoute(userLat, userLon, vetLat, vetLon, map) {
  const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjM4Yzc2MTYyNmY3ODRiMDM4Mjc1NWQ4Nzc1MTY0MWEwIiwiaCI6Im11cm11cjY0In0=';
  const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [
          [userLon, userLat],
          [vetLon, vetLat]
        ]
      })
    });

    const data = await response.json();

    const routeLayer = L.geoJSON(data, { style: { color: 'blue' } }).addTo(map);
    return routeLayer;

  } catch (err) {
    console.error('Error fetching ORS route:', err);
  }
}
