// Add this function to your main.js
async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'firstpage.html'; // Redirect to login
            return;
        }

        const response = await fetch('http://localhost:5001/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const user = await response.json();
        
        // Update user name and SkillCoins
        document.querySelector('h2').textContent = `Welcome, ${user.name}`;
        document.querySelector('.coins').textContent = user.skillCoins;
        
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
});
