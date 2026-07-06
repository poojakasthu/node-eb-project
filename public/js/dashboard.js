// -----------------------------
// TravelGo Admin Dashboard
// -----------------------------

window.onload = function () {

    loadUser();

    loadStats();

    loadBookings();

};

// -----------------------------
// Load Logged In User
// -----------------------------

async function loadUser() {

    try {

        const response = await fetch("/api/user");

        const data = await response.json();

        document.getElementById("adminName").innerHTML =
            data.user.username;

    }

    catch {

        window.location.href = "/login";

    }

}

// -----------------------------
// Dashboard Statistics
// -----------------------------

async function loadStats() {

    const response = await fetch("/api/stats");

    const stats = await response.json();

    document.getElementById("totalBookings").innerHTML =
        stats.totalBookings;

    document.getElementById("confirmedBookings").innerHTML =
        stats.confirmed;

    document.getElementById("cancelledBookings").innerHTML =
        stats.cancelled;

    document.getElementById("totalRevenue").innerHTML =
        stats.revenue;

}

// -----------------------------
// Load Bookings
// -----------------------------

async function loadBookings() {

    const response = await fetch("/api/bookings");

    const bookings = await response.json();

    const table =
        document.getElementById("bookingTable");

    table.innerHTML = "";

    bookings.reverse().forEach((booking) => {

        table.innerHTML += `

<tr>

<td>${booking.id}</td>

<td>${booking.name}</td>

<td>${booking.destination}</td>

<td>${booking.phone}</td>

<td>${booking.travelDate}</td>

<td>

${booking.status}

</td>

<td>

<button
class="edit-btn"
onclick="editBooking(${booking.id})">

Edit

</button>

<button
class="cancel-btn"
onclick="cancelBooking(${booking.id})">

Cancel

</button>

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

// -----------------------------
// Delete Booking
// -----------------------------

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

// -----------------------------
// Cancel Booking
// -----------------------------

async function cancelBooking(id) {

    const confirmCancel =
        confirm("Cancel this booking?");

    if (!confirmCancel)
        return;

    await fetch(`/api/bookings/${id}/cancel`, {

        method: "PATCH"

    });

    loadBookings();

    loadStats();

}

// -----------------------------
// Edit Booking
// -----------------------------

function editBooking(id) {

    alert(
        "Edit Booking feature will be added in Phase 2.\nBooking ID : " + id
    );

}

// -----------------------------
// Search
// -----------------------------

function searchBooking() {

    const value =
        document.getElementById("searchBooking")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(value)) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}
