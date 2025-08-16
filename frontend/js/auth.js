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
      // Store authentication data
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      localStorage.setItem('user', JSON.stringify(result.user || result));
      
      // Store individual user properties for chat system
      localStorage.setItem('userId', result.user?.id || result.id || result._id);
      localStorage.setItem('userName', result.user?.name || result.name || name);
      localStorage.setItem('userEmail', result.user?.email || result.email || email);
      localStorage.setItem('userRole', result.role || 'user');
      
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
      // Store authentication data
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      localStorage.setItem('user', JSON.stringify(result.user || result));
      
      // Store individual user properties for chat system
      localStorage.setItem('userId', result.user?.id || result.id || result._id);
      localStorage.setItem('userName', result.user?.name || result.name || name);
      localStorage.setItem('userEmail', result.user?.email || result.email);
      localStorage.setItem('userRole', result.role || 'user');
      
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