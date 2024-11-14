// forgot-password.js

// Select form and input elements
const form = document.querySelector("form");
const emailInput = document.querySelector("input[type='email']");

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

// Handle form submission
form.addEventListener("submit", (event) => {
    const email = emailInput.value;

    // Check if email is valid
    if (!validateEmail(email)) {
        event.preventDefault();  // Prevent form submission
        alert("Please enter a valid email address.");
    } else {
        // Show a loading or success message (optional)
        alert("If this email is registered, you will receive a reset link shortly.");
    }
});
