document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Collect form data
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            // Validate input
            if (!email || !password) {
                alert("Please fill in both email and password.");
                return;
            }

            try {
                // Send login request to the backend
                const response = await fetch("http://localhost:5001/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save token to localStorage
                    localStorage.setItem("token", data.token);
                    alert("Login successful!");
                    window.location.href = "mainpage.html"; // Redirect to main page
                } else {
                    alert(data.message || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred. Please try again.");
            }
        });
    } else {
        console.error("❌ Form with ID 'login-form' not found!");
    }
});
function displaySkills(skills) {
    const container = document.getElementById("skill-container");
    container.innerHTML = "";

    if (skills.length === 0) {
        container.innerHTML = "<p>No skills found.</p>";
        return;
    }

    skills.forEach(skill => {
        const skillCard = document.createElement("div");
        skillCard.classList.add("skill-card");
        skillCard.innerHTML = `
            <h4>${skill.skillName}</h4>
            <p>${skill.description}</p>
            <p><strong>Cost:</strong> ${skill.skillCoins} SkillCoins</p>
            <button class="btn spend-skillcoins" data-cost="${skill.skillCoins}">Spend ${skill.skillCoins} SkillCoins</button>
            <div class="video-container" style="display:none;">
                <video width="100%" controls>
                    <source src="${skill.videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        // Append the card
        container.appendChild(skillCard);

        // Add event listener to the button
        const button = skillCard.querySelector(".spend-skillcoins");
        const videoContainer = skillCard.querySelector(".video-container");
        button.addEventListener("click", () => {
            // Spend SkillCoins logic can be added here
            videoContainer.style.display = "block"; // Show the video
        });
    });
}
