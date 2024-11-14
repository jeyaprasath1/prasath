// /js/index.js

// Script to handle navigation links for active states and simple interactive features

document.addEventListener('DOMContentLoaded', () => {
    // Highlight the active navigation link
    const navLinks = document.querySelectorAll('#navLinks li a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active'); // Add active class for styling
        }
    });

    // Handle click event for the Sign Up and Sign In buttons
    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Example of potential functionality: log button clicked
            console.log(`${event.target.textContent} button clicked!`);
        });
    });

    // Animate cards on hover for user engagement
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover-effect');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover-effect');
        });
    });
});
