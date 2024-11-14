document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember');
    const loginButton = document.getElementById('submit');

    // Event listener for form submission
    form.addEventListener('submit', function(event) {
        // Clear previous error messages
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(el => el.remove());

        let isValid = true;

        // Validate Username
        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "Username is required");
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "Password is required");
            isValid = false;
        }

        // Prevent form submission if validation fails
        if (!isValid) {
            event.preventDefault();
        } else {
            // Optionally save login info if 'Remember me' is checked
            if (rememberMeCheckbox.checked) {
                saveLoginInfo(usernameInput.value);
            } else {
                clearLoginInfo();
            }
        }
    });

    // Save login information in localStorage
    function saveLoginInfo(username) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', username);
    }

    // Clear login information from localStorage
    function clearLoginInfo() {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
    }

    // Check if 'Remember me' was previously selected and auto-fill the username
    if (localStorage.getItem('rememberMe') === 'true') {
        usernameInput.value = localStorage.getItem('username');
        rememberMeCheckbox.checked = true;
    }

    // Function to show error messages below input fields
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.style.color = 'red';
        errorElement.textContent = message;
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
});
