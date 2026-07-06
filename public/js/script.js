// ----------------------------
// TravelGo Frontend Script
// ----------------------------

// Auto load data when page opens
window.onload = () => {
    loadBookings();
    loadStats();
};

// Select destination from package cards
function selectDestination(destination) {
    document.getElementById("destination").value = destination;
    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}

// Booking Form Submit
document.getElementById("bookingForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const booking = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        destination: document.getElementById("destination").value,
        travellers: document.getElementById("travellers").value,
        travelDate: document.getElementById("travelDate").value
    };

    const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    const result = await response.json();

    document.getElementById("message").innerHTML =
        "✅ Booking Confirmed Successfully!";

    document.getElementById("bookingForm").reset();

    loadBookings();
    loadStats();

});

// Load All Bookings
async function loadBookings() {

    const response = await fetch("/api/bookings");

    const bookings = await response.json();

    const table = document.getElementById("bookingTable");

    table.innerHTML = "";

    bookings.reverse().forEach((booking) => {

        table.innerHTML += `

        <tr>

        <td>${booking.id}</td>

        <td>${booking.name}</td>

        <td>${booking.destination}</td>

        <td>${booking.travellers}</td>

        <td>${booking.travelDate}</td>

        <td>
            <span style="color:green;font-weight:bold;">
            ${booking.status}
            </span>
        </td>

        <td>

        <button
        class="delete-btn"
        onclick="deleteBooking(${booking.id})">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}

// Delete Booking
async function deleteBooking(id) {

    const confirmDelete =
        confirm("Delete this booking?");

    if (!confirmDelete)
        return;

    await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
    });

    loadBookings();
    loadStats();

}

// Dashboard Statistics
async function loadStats() {

    const response = await fetch("/api/stats");

    const stats = await response.json();

    document.getElementById("totalBookings").innerHTML =
        stats.totalBookings;

    document.getElementById("confirmed").innerHTML =
        stats.confirmed;

    document.getElementById("cancelled").innerHTML =
        stats.cancelled;

}

// Search Booking
function searchBookings() {

    let input =
        document.getElementById("search")
        .value
        .toLowerCase();

    let rows =
        document.querySelectorAll("#bookingTable tr");

    rows.forEach((row) => {

        let text =
            row.innerText.toLowerCase();

        if (text.includes(input)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}
