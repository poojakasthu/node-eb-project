// -----------------------------
// TravelGo Admin Dashboard
// -----------------------------

window.onload = function () {
    loadUser();
    loadStats();
    loadBookings();
    checkHealth();
};

// -----------------------------
// Toast Notification System
// -----------------------------
function toast(message, type = "success") {
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.innerText = message;

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 2500);
}

// -----------------------------
// Load Logged-in User
// -----------------------------
async function loadUser() {
    try {
        const res = await fetch("/api/user");

        if (!res.ok) throw new Error();

        const user = await res.json();

        document.getElementById("adminName").innerText = user.username;

    } catch (err) {
        window.location.href = "/login";
    }
}

// -----------------------------
// Load Dashboard Stats
// -----------------------------
async function loadStats() {
    try {
        const res = await fetch("/api/admin/stats");
        const stats = await res.json();

        document.getElementById("totalBookings").innerText = stats.totalBookings;
        document.getElementById("confirmedBookings").innerText = stats.confirmed;
        document.getElementById("cancelledBookings").innerText = stats.cancelled;
        document.getElementById("totalRevenue").innerText = stats.revenue;

    } catch (err) {
        toast("Failed to load stats", "error");
    }
}

// -----------------------------
// Load Bookings Table
// -----------------------------
async function loadBookings() {
    try {
        const res = await fetch("/api/admin/bookings");
        const bookings = await res.json();

        const table = document.getElementById("bookingTable");
        table.innerHTML = "";

        bookings.reverse().forEach(b => {

            table.innerHTML += `
                <tr>
                    <td>${b.id}</td>
                    <td>${b.customerName}</td>
                    <td>${b.destination}</td>
                    <td>${b.phone}</td>
                    <td>${b.email}</td>
                    <td>${b.travellers}</td>
                    <td>${b.amount}</td>
                    <td>${b.paymentStatus}</td>
                    <td>${b.bookingStatus}</td>
                    <td>${b.bookedOn}</td>
                    <td>
                        <button onclick="editBooking(${b.id})">Edit</button>
                        <button onclick="cancelBooking(${b.id})">Cancel</button>
                        <button onclick="deleteBooking(${b.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        toast("Failed to load bookings", "error");
    }
}

// -----------------------------
// Delete Booking
// -----------------------------
async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;

    const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
        toast("Booking deleted");
        loadBookings();
        loadStats();
    } else {
        toast("Delete failed", "error");
    }
}

// -----------------------------
// Cancel Booking
// -----------------------------
async function cancelBooking(id) {
    if (!confirm("Cancel this booking?")) return;

    const res = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: "PATCH"
    });

    const data = await res.json();

    if (data.success) {
        toast("Booking cancelled");
        loadBookings();
        loadStats();
    } else {
        toast("Cancel failed", "error");
    }
}

// -----------------------------
// Edit Booking (simple prompt version)
// -----------------------------
async function editBooking(id) {
    const customerName = prompt("Customer Name:");
    const phone = prompt("Phone:");
    const email = prompt("Email:");
    const destination = prompt("Destination:");
    const travellers = prompt("Travellers:");
    const amount = prompt("Amount:");

    if (!customerName || !phone || !email || !destination) {
        toast("Update cancelled", "error");
        return;
    }

    const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customerName,
            phone,
            email,
            destination,
            travellers,
            amount
        })
    });

    const data = await res.json();

    if (data.success) {
        toast("Booking updated");
        loadBookings();
        loadStats();
    } else {
        toast("Update failed", "error");
    }
}

// -----------------------------
// Search Bookings
// -----------------------------
function searchBooking() {
    const value = document.getElementById("searchBooking").value.toLowerCase();
    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {
        row.style.display =
            row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}

// -----------------------------
// Refresh Dashboard
// -----------------------------
function refreshDashboard() {
    loadStats();
    loadBookings();
    toast("Dashboard refreshed");
}

// -----------------------------
// Logout
// -----------------------------
async function logout() {
    await fetch("/api/logout");
    window.location.href = "/login";
}

// -----------------------------
// Health Check
// -----------------------------
async function checkHealth() {
    try {
        const res = await fetch("/health");
        const data = await res.json();

        const el = document.getElementById("healthStatus");
        if (el) el.innerText = data.status;

    } catch {
        toast("Server not responding", "error");
    }
}

// -----------------------------
// Dark Mode Toggle
// -----------------------------
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
