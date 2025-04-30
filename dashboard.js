// // dashboard.js

// document.addEventListener("DOMContentLoaded", async function () {
//     // Fetch user data and populate form fields
//     const userId = localStorage.getItem("userId");  // Assume user ID is stored in localStorage

//     if (!userId) {
//         alert("User not found! Redirecting to sign-in...");
//         window.location.href = "signin.html";  // Redirect if the user is not authenticated
//         return;
//     }

//     try {
//         const response = await fetch(`http://localhost:5000/api/user/profile`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         if (!response.ok) {
//             throw new Error('Failed to load user data');
//         }

//         const userData = await response.json();
//         document.getElementById("fullname").value = userData.fullname;  // Pre-fill the form
//         document.getElementById("bio").value = userData.bio;  // Pre-fill the form
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });

// // Handle the profile update form submission
// document.getElementById('edit-profile-form').addEventListener('submit', async function (event) {
//     event.preventDefault();  // Prevent the default form submission

//     const fullname = document.getElementById('fullname').value;
//     const bio = document.getElementById('bio').value;

//     // Create the request body for the PUT request
//     const updatedData = { fullname, bio };

//     try {
//         const response = await fetch('http://localhost:5000/api/user/profile', {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             },
//             body: JSON.stringify(updatedData),
//         });

//         if (response.ok) {
//             const result = await response.json();
//             alert('Profile updated successfully!');
//             console.log(result);
//         } else {
//             const error = await response.json();
//             alert(`Error: ${error.message}`);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         alert('Failed to update profile. Please try again.');
//     }
// });
