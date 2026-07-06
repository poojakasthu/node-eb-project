// ===============================
// TravelGo Frontend
// ===============================

const API = "/api";

// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadDestinations();

    loadFavouriteDestinations();

    loadReviews();

    setupBookingForm();

    setupContactForm();

});

// ===============================
// Load Destinations
// ===============================

async function loadDestinations() {

    try {

        const response = await fetch(`${API}/destinations`);

        const destinations = await response.json();

        const container = document.getElementById("destinationContainer");

        if (!container) return;

        container.innerHTML = "";

        destinations.forEach(destination => {

            container.innerHTML += `

<div class="card fade">

<img src="https://picsum.photos/400/250?random=${destination.id}">

<div class="card-content">

<h3>${destination.name}</h3>

<p>${destination.days}</p>

<p class="price">₹${destination.price}</p>

<button onclick="selectDestination('${destination.name}',${destination.price})">

Book Now

</button>

</div>

</div>

`;

        });

    }

    catch(err){

        console.error(err);

    }

}

// ===============================
// Search Destination
// ===============================

function searchDestination(){

    const value = document
    .getElementById("searchDestination")
    .value
    .toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card=>{

        if(card.innerText.toLowerCase().includes(value)){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

}

// ===============================
// Auto Fill Booking
// ===============================

function selectDestination(name,price){

    document.getElementById("destination").value=name;

    document.getElementById("amount").value=price;

    document.getElementById("booking")
    .scrollIntoView({

        behavior:"smooth"

    });

}

// ===============================
// Booking Form
// ===============================

function setupBookingForm(){

    const form=document.getElementById("bookingForm");

    if(!form) return;

    form.addEventListener("submit",bookTrip);

}

async function bookTrip(e){

    e.preventDefault();

    const booking={

        customerName:document.getElementById("customerName").value,

        email:document.getElementById("email").value,

        phone:document.getElementById("phone").value,

        destination:document.getElementById("destination").value,

        travellers:Number(document.getElementById("travellers").value),

        amount:Number(document.getElementById("amount").value)

    };

    const response=await fetch(`${API}/bookings`,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(booking)

    });

    const result=await response.json();

    if(result.success){

        showToast("Booking Created Successfully");

        localStorage.setItem(

            "bookingId",

            result.booking.id

        );

        setTimeout(()=>{

            window.location.href="/payment.html";

        },1000);

    }

}

// ===============================
// Favourite Destinations
// ===============================

async function loadFavouriteDestinations(){

    try{

        const response=await fetch(`${API}/favourites`);

        const data=await response.json();

        const container=document.getElementById("favouriteContainer");

        if(!container) return;

        container.innerHTML="";

        data.forEach(item=>{

            container.innerHTML+=`

<div class="favourite-card scale">

<h3>${item.name}</h3>

<p>${item.days}</p>

<p class="price">

₹${item.price}

</p>

<button onclick="selectDestination('${item.name}',${item.price})">

Book

</button>

</div>

`;

        });

    }

    catch(err){

        console.log(err);

    }

}

// ===============================
// Reviews
// ===============================

async function loadReviews(){

    try{

        const response=await fetch(`${API}/reviews`);

        const reviews=await response.json();

        const container=document.getElementById("reviewContainer");

        if(!container) return;

        container.innerHTML="";

        reviews.forEach(review=>{

            container.innerHTML+=`

<div class="review-card fade">

<h3>${review.name}</h3>

<span>

${"⭐".repeat(review.rating)}

</span>

<p>

${review.comment}

</p>

</div>

`;

        });

    }

    catch(err){

        console.log(err);

    }

}

// ===============================
// Contact Form
// ===============================

function setupContactForm(){

    const form=document.getElementById("contactForm");

    if(!form) return;

    form.addEventListener("submit",sendMessage);

}

async function sendMessage(e){

    e.preventDefault();

    const body={

        name:document.getElementById("contactName").value,

        email:document.getElementById("contactEmail").value,

        message:document.getElementById("contactMessage").value

    };

    await fetch(`${API}/contact`,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(body)

    });

    showToast("Message Sent Successfully");

    document.getElementById("contactForm").reset();

}

// ===============================
// Dark Mode
// ===============================

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "darkMode",

        document.body.classList.contains("dark")

    );

}

if(localStorage.getItem("darkMode")==="true"){

    document.body.classList.add("dark");

}

// ===============================
// Toast
// ===============================

function showToast(message){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        toast.className="toast";

        document.body.appendChild(toast);

    }

    toast.innerHTML=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}
