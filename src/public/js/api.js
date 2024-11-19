// // Function to handle authenticated requests with token refresh
// async function fetchWithAuth(url, options = {}, retry = true) {
//     try {
//         const response = await fetch(url, {
//             ...options,
//             credentials: 'include', // Include cookies in the request
//         });

//         if (response.status === 401 && retry) {
//             // Access token expired, try to refresh it
//             const refreshResponse = await fetch('/refresh-token', {
//                 method: 'POST',
//                 credentials: 'include', // Include cookies in the request
//             });

//             if (refreshResponse.ok) {
//                 // Retry the original request with the new access token
//                 return fetchWithAuth(url, options, false);
//             } else {
//                 // Refresh token failed, redirect to login
//                 console.error('Refresh token failed. Redirecting to login.');
//                 window.location.href = '/login';
//             }
//         }

//         return response;
//     } catch (error) {
//         console.error('Network or server error:', error);
//         throw error; // Optionally rethrow the error for higher-level handling
//     }
// }

// // Initialize client-side logic
// document.addEventListener('DOMContentLoaded', function () {
//     // Example: Fetch protected data on page load
//     async function getProtectedData() {
//         try {
//             const response = await fetchWithAuth('/protected/data', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('Protected data:', data);
//             } else {
//                 console.error('Failed to fetch protected data');
//             }
//         } catch (error) {
//             console.error('Error fetching protected data:', error);
//         }
//     }

//     getProtectedData();

//     // Example: Handle form submission
//     const form = document.getElementById('exampleForm');
//     if (form) {
//         form.addEventListener('submit', async function (event) {
//             event.preventDefault();
//             const formData = new FormData(form);
//             const jsonData = {};
//             formData.forEach((value, key) => {
//                 jsonData[key] = value;
//             });

//             try {
//                 const response = await fetchWithAuth('/protected/submit', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(jsonData),
//                 });

//                 if (response.ok) {
//                     const result = await response.json();
//                     console.log('Form submitted successfully:', result);
//                 } else {
//                     console.error('Failed to submit form');
//                 }
//             } catch (error) {
//                 console.error('Error submitting form:', error);
//             }
//         });
//     }
// });
