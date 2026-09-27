const form = document.getElementById("signupForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    const message = document.getElementById("message");


    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        password === "" ||
        confirmPassword === "" ||
        role === ""
    ) {

        message.textContent = "Please fill all the fields.";

        return;
    }


    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match.";

        return;
    }


    // Create user

    const user = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role
    };


    // Get existing users

    let users = JSON.parse(localStorage.getItem("users")) || [];


    // Add new user

    users.push(user);


    // Save all users

    localStorage.setItem("users", JSON.stringify(users));


    message.textContent = "Account created successfully!";


    setTimeout(function() {

        window.location.href = "login.html";

    }, 1000);

});