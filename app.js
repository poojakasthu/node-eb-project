const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, "data", "database.json");

// ---------------------------
// Middleware
// ---------------------------

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "travelgo-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);

// ---------------------------
// Database Functions
// ---------------------------

function readDB() {

    if (!fs.existsSync(DB_FILE)) {

        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(
                {
                    bookings: [],
                    reviews: [],
                    destinations: []
                },
                null,
                2
            )
        );

    }

    return JSON.parse(
        fs.readFileSync(DB_FILE)
    );

}

function writeDB(data) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(data, null, 2)
    );

}

// ---------------------------
// Authentication Middleware
// ---------------------------

function isLoggedIn(req, res, next) {

    if (req.session.loggedIn) {

        return next();

    }

    return res.status(401).json({
        success: false,
        message: "Unauthorized"
    });

}
// ---------------------------
// Pages
// ---------------------------

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );

});

app.get("/dashboard", (req, res) => {

    if (!req.session.loggedIn) {

        return res.redirect("/login");

    }

    res.sendFile(
        path.join(__dirname, "public", "dashboard.html")
    );

});

// ---------------------------
// Authentication
// ---------------------------

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        req.session.loggedIn = true;

        req.session.user = {
            username: "admin",
            role: "Administrator"
        };

        return res.json({
            success: true
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid Credentials"
    });

});

app.get("/api/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true
        });

    });

});

app.get("/api/user", isLoggedIn, (req, res) => {

    res.json(req.session.user);

    
});
// ---------------------------
// Public APIs
// ---------------------------

// Get All Destinations

app.get("/api/destinations", (req, res) => {

    const db = readDB();

    res.json(db.destinations);

});

// Get Customer Reviews

app.get("/api/reviews", (req, res) => {

    const db = readDB();

    res.json(db.reviews);

});

// Create Booking (Public)

app.post("/api/bookings", (req, res) => {

    const db = readDB();

    const booking = {

        id: Date.now(),

        customerName: req.body.customerName,

        phone: req.body.phone,

        email: req.body.email,

        destination: req.body.destination,

        travellers: Number(req.body.travellers),

        amount: Number(req.body.amount),

        paymentStatus: "Pending",

        bookingStatus: "Booked",

        bookedOn: new Date().toLocaleString()

    };

    db.bookings.push(booking);

    writeDB(db);

    res.json({

        success: true,

        booking

    });

});

// Get Latest Booking

app.get("/api/bookings/latest", (req, res) => {

    const db = readDB();

    if (db.bookings.length === 0) {

        return res.json(null);

    }

    res.json(

        db.bookings[db.bookings.length - 1]

    );

});


// ---------------------------
// Admin APIs
// ---------------------------

// All Bookings

app.get("/api/admin/bookings", isLoggedIn, (req, res) => {

    const db = readDB();

    res.json(db.bookings);

});

// Dashboard Statistics

app.get("/api/admin/stats", isLoggedIn, (req, res) => {

    const db = readDB();

    const totalBookings = db.bookings.length;

    const confirmed = db.bookings.filter(

        b => b.bookingStatus === "Booked"

    ).length;

    const cancelled = db.bookings.filter(

        b => b.bookingStatus === "Cancelled"

    ).length;

    const revenue = db.bookings.reduce(

        (sum, b) => sum + Number(b.amount),

        0

    );

    res.json({

        totalBookings,

        confirmed,

        cancelled,

        revenue

    });

});


// Update Booking

app.put("/api/admin/bookings/:id", isLoggedIn, (req, res) => {

    const db = readDB();

    const booking = db.bookings.find(

        b => b.id == req.params.id

    );

    if (!booking) {

        return res.status(404).json({

            success: false,

            message: "Booking Not Found"

        });

    }

    booking.customerName = req.body.customerName;

    booking.phone = req.body.phone;

    booking.email = req.body.email;

    booking.destination = req.body.destination;

    booking.travellers = req.body.travellers;

    booking.amount = req.body.amount;

    writeDB(db);

    res.json({

        success: true,

        message: "Booking Updated"

    });

});


// Cancel Booking

app.patch("/api/admin/bookings/:id/cancel", isLoggedIn, (req, res) => {

    const db = readDB();

    const booking = db.bookings.find(

        b => b.id == req.params.id

    );

    if (!booking) {

        return res.status(404).json({

            success: false

        });

    }

    booking.bookingStatus = "Cancelled";

    writeDB(db);

    res.json({

        success: true

    });

});


// Delete Booking

app.delete("/api/admin/bookings/:id", isLoggedIn, (req, res) => {

    const db = readDB();

    db.bookings = db.bookings.filter(

        b => b.id != req.params.id

    );

    writeDB(db);

    res.json({

        success: true

    });

});
// ---------------------------
// Payment API
// ---------------------------

app.post("/api/payment", (req, res) => {

    const { bookingId } = req.body;

    const db = readDB();

    const booking = db.bookings.find(
        b => b.id == bookingId
    );

    if (!booking) {

        return res.status(404).json({
            success: false,
            message: "Booking Not Found"
        });

    }

    booking.paymentStatus = "Paid";

    booking.paymentDate = new Date().toLocaleString();

    writeDB(db);

    res.json({
        success: true,
        message: "Payment Successful",
        booking
    });

});


// ---------------------------
// Booking Receipt
// ---------------------------

app.get("/api/receipt/:id", (req, res) => {

    const db = readDB();

    const booking = db.bookings.find(
        b => b.id == req.params.id
    );

    if (!booking) {

        return res.status(404).json({
            success: false,
            message: "Receipt Not Found"
        });

    }

    res.json(booking);

});


// ---------------------------
// Favourite Destinations
// ---------------------------

app.get("/api/favourites", (req, res) => {

    const db = readDB();

    const favourites = db.destinations.filter(
        d => d.price <= 20000
    );

    res.json(favourites);

});


// ---------------------------
// Add Customer Review
// ---------------------------

app.post("/api/reviews", (req, res) => {

    const db = readDB();

    const review = {

        id: Date.now(),

        name: req.body.name,

        rating: Number(req.body.rating),

        comment: req.body.comment

    };

    db.reviews.push(review);

    writeDB(db);

    res.json({
        success: true,
        review
    });

});


// ---------------------------
// Contact Form
// ---------------------------

app.post("/api/contact", (req, res) => {

    console.log("Contact Form");

    console.log(req.body);

    res.json({

        success: true,

        message: "Thank you for contacting TravelGo."

    });

});


// ---------------------------
// Health Check
// ---------------------------

app.get("/health", (req, res) => {

    res.json({

        application: "TravelGo",

        version: "1.0.0",

        status: "Running",

        serverTime: new Date()

    });

});


// ---------------------------
// 404
// ---------------------------

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Page Not Found"

    });

});


// ---------------------------
// Start Server
// ---------------------------

app.listen(PORT, () => {

    console.log(`🚀 TravelGo Server Running on Port ${PORT}`);

});
