const bookingId = localStorage.getItem("bookingId");

if (!bookingId) {

    alert("No booking found.");

    window.location.href = "/";

}

loadBooking();

async function loadBooking() {

    const response = await fetch(`/api/receipt/${bookingId}`);

    const booking = await response.json();

    document.getElementById("bookingId").innerText = booking.id;

    document.getElementById("amount").innerText = booking.amount;

}

document.getElementById("payBtn").addEventListener("click", makePayment);

async function makePayment() {

    const response = await fetch("/api/payment", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            bookingId

        })

    });

    const result = await response.json();

    if (result.success) {

        alert("Payment Successful!");

        window.location.href = `/receipt.html?id=${bookingId}`;

    }

    else {

        alert(result.message);

    }

}
