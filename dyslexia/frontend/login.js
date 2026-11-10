
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    // Prevent the form from refreshing the page
    event.preventDefault();

    // Get the entered values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simple frontend demonstration
    if (username.trim() !== "" && password.trim() !== "") {

        // Store username for the next page
        sessionStorage.setItem("username", username);

        // Navigate to the second page
        window.location.href = "upload.html";

    } else {

        document.getElementById("message").innerText =
            "Please enter username and password";

    }

});
