const savedAttendee = localStorage.getItem("attendee");

if (savedAttendee === null) {
    window.location.href = "index.html";
} else {
    const attendee = JSON.parse(savedAttendee);

    document.getElementById("greeting").textContent =
        "Congrats, " + attendee.name + "! Your ticket is ready.";

    document.getElementById("ticketAvatar").src = attendee.avatar;
    document.getElementById("ticketName").textContent = attendee.name;
    document.getElementById("ticketGithub").textContent = attendee.github;
    document.getElementById("ticketNumber").textContent = attendee.ticketNumber;
}