document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        // This toggles the 'active' class defined in the CSS above
        navLinks.classList.toggle('active');
        
        // Optional: Animate hamburger into an 'X'
        hamburger.classList.toggle('toggle-icon');
    });
});