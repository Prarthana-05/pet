document.addEventListener('DOMContentLoaded', () => {
      const loginSection = document.getElementById('loginFormSection');
      const registerSection = document.getElementById('registerFormSection');

      document.getElementById('showRegisterLink').addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
      });

      document.getElementById('showLoginLink').addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
      });
    });