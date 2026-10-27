const form = document.getElementById("registrationForm");

form.addEventListener("submit", function(event) {
event.preventDefault();


const name = document.getElementById("fullName").value.trim();
const email = document.getElementById("email").value.trim();
const github = document.getElementById("github").value.trim();
const avatar = document.getElementById("avatar").files[0];

let valid = true;

document.getElementById("nameError").textContent = "";
document.getElementById("emailError").textContent = "";
document.getElementById("githubError").textContent = "";
document.getElementById("avatarError").textContent = "";

if (name === "") {
    document.getElementById("nameError").textContent =
        "Enter your full name.";
    valid = false;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent =
        "Enter a valid email address.";
    valid = false;
}

if (github === "" || github.startsWith("@")) {
    document.getElementById("githubError").textContent =
        "Enter your username without the @ symbol.";
    valid = false;
}

if (!avatar) {
    document.getElementById("avatarError").textContent =
        "Please select an avatar.";
    valid = false;
} else if (
    !["image/jpeg", "image/png"].includes(avatar.type) ||
    avatar.size >= 500 * 1024
) {
    document.getElementById("avatarError").textContent =
        "Use a JPEG or PNG smaller than 500KB.";
    valid = false;
}

if (valid) {
    const reader = new FileReader();

    reader.onload = function() {
        const attendee = {
            name: name,
            email: email,
            github: "@" + github.replace(/^@/, ""),
            avatar: reader.result,
            ticketNumber: "#" + Math.floor(10000 + Math.random() * 90000)
        };

        localStorage.setItem("attendee", JSON.stringify(attendee));

        window.location.href = "ticket.html";
    };

    reader.readAsDataURL(avatar);
}


});
