// Get logged-in user

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));


// Check if user is logged in

if (!loggedInUser) {
    window.location.href = "login.html";
}


// Display current information

document.getElementById("profileName").textContent =
    loggedInUser.name;

document.getElementById("profileEmail").textContent =
    loggedInUser.email;

document.getElementById("profilePhone").textContent =
    loggedInUser.phone;

document.getElementById("profileRole").textContent =
    loggedInUser.role;


// Fill edit fields

document.getElementById("editName").value =
    loggedInUser.name;

document.getElementById("editPhone").value =
    loggedInUser.phone;


// Save changes

document.getElementById("saveProfile")
    .addEventListener("click", function() {

        const newName =
            document.getElementById("editName").value.trim();

        const newPhone =
            document.getElementById("editPhone").value.trim();

        const profileMessage =
            document.getElementById("profileMessage");


        if (newName === "" || newPhone === "") {
            profileMessage.textContent =
                "Please fill all the fields.";
            return;
        }


        // Update logged-in user

        loggedInUser.name = newName;
        loggedInUser.phone = newPhone;


        // Update users array

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        users = users.map(function(user) {

            if (user.email === loggedInUser.email) {
                user.name = newName;
                user.phone = newPhone;
            }

            return user;
        });


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );


        // Update displayed information

        document.getElementById("profileName").textContent =
            newName;

        document.getElementById("profilePhone").textContent =
            newPhone;

        profileMessage.textContent =
            "Profile updated successfully!";

    });