const params = new URLSearchParams(window.location.search);

const bookingId = params.get("id");

loadReceipt();

async function loadReceipt() {

    const response = await fetch(`/api/receipt/${bookingId}`);

    const booking = await response.json();

    document.getElementById("receipt").innerHTML = `

        <p><strong>Booking ID:</strong> ${booking.id}</p>

        <p><strong>Customer:</strong> ${booking.customerName}</p>

        <p><strong>Email:</strong> ${booking.email}</p>

        <p><strong>Phone:</strong> ${booking.phone}</p>

        <p><strong>Destination:</strong> ${booking.destination}</p>

        <p><strong>Travellers:</strong> ${booking.travellers}</p>

        <p><strong>Amount:</strong> ₹${booking.amount}</p>

        <p><strong>Payment:</strong> ${booking.paymentStatus}</p>

        <p><strong>Booking Status:</strong> ${booking.bookingStatus}</p>

        <p><strong>Booked On:</strong> ${booking.bookedOn}</p>

        <p><strong>Payment Date:</strong> ${booking.paymentDate || "-"}</p>

    `;

}
