import { registerUser, loginUser } from './api.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;

    const result = await registerUser(email, name, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      
      // ADD THIS LINE - store user data
      localStorage.setItem('user', JSON.stringify(result.user || result));
      
      if (result.role === 'admin') {
        window.location.href = 'index.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    } else {
      alert(result.message || 'Registration failed');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('logName').value;
    const password = document.getElementById('logPassword').value;

    const result = await loginUser(name, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      
      // ADD THIS LINE - store user data
      localStorage.setItem('user', JSON.stringify(result.user || result));
      
      if (result.role === 'admin') {
        window.location.href = 'home.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    } else {
      alert(result.message || 'Login failed');
    }
  });
}