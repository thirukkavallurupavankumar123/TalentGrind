document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const countryCodeSelect = document.getElementById("country-code");
    const mobileInput = document.getElementById("mobile_number");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");
    const passwordRequirements = document.getElementById("password-requirements");

    // ✅ Update mobile number field when country is selected
    countryCodeSelect.addEventListener("change", function () {
        mobileInput.value = this.value + " "; // Set default country code
        mobileInput.focus();
    });

    // ✅ Password strength validation function
    function validatePassword(password) {
        const minLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@#$%^&*!]/.test(password);

        let errors = [];
        if (!minLength) errors.push("- At least 8 characters long");
        if (!hasNumber) errors.push("- At least 1 number (0-9)");
        if (!hasSpecialChar) errors.push("- At least 1 special character (@, #, $, etc.)");

        if (errors.length > 0) {
            passwordRequirements.style.display = "block";
            passwordRequirements.innerHTML = errors.join("<br>");
            return false;
        } else {
            passwordRequirements.style.display = "none";
            return true;
        }
    }

    // ✅ Check password strength in real-time
    passwordInput.addEventListener("input", function () {
        validatePassword(passwordInput.value);
    });

    // ✅ Check if passwords match in real-time
    confirmPasswordInput.addEventListener("input", function () {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordError.style.display = "block";
        } else {
            passwordError.style.display = "none";
        }
    });

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
        const fullName = document.getElementById("fullname").value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = document.getElementById("age").value;
        const countryCode = document.getElementById("country-code").value;
        const mobileNumber = document.getElementById("mobile_number").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validate passwords
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Send data to the backend
            const response = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    gender,
                    age,
                    mobileNumber: `${countryCode}${mobileNumber}`,
                    email,
                    username,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful! Please log in.");
                window.location.href = "loginpage.html"; // Redirect to login page
            } else {
                alert(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
