
const form = document.getElementById("loginForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");


    if (email === "" || password === "") {

        message.textContent = "Please enter email and password.";

        return;
    }


    // Get all users

    const users = JSON.parse(localStorage.getItem("users")) || [];


    // Find the user

    const user = users.find(function(user) {

        return user.email === email && user.password === password;

    });


    if (!user) {

        message.textContent = "Incorrect email or password.";

        return;
    }
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    message.textContent = "Login successful!";


    // Go to correct dashboard

    setTimeout(function() {

        if (user.role === "student") {

            window.location.href = "student-dashboard.html";

        }

        else if (user.role === "client") {

            window.location.href = "client-dashboard.html";

        }

    }, 1000);

});