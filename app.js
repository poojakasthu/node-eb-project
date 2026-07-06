const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "data", "database.json");

// -------------------------
// Middleware
// -------------------------

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "travelgo-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 // 1 Hour
        }
    })
);

// -------------------------
// Database Functions
// -------------------------

function readDatabase() {

    if (!fs.existsSync(DB_PATH)) {

        fs.writeFileSync(
            DB_PATH,
            JSON.stringify(
                {
                    bookings: []
                },
                null,
                2
            )
        );

    }

    return JSON.parse(
        fs.readFileSync(DB_PATH)
    );

}

function writeDatabase(data) {

    fs.writeFileSync(
        DB_PATH,
        JSON.stringify(data, null, 2)
    );

}

// -------------------------
// Authentication Middleware
// -------------------------

function isAuthenticated(req, res, next) {

    if (req.session.loggedIn) {

        return next();

    }

    return res.redirect("/login.html");

}

// -------------------------
// Public Routes
// -------------------------

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Dashboard Page (Protected)
app.get("/dashboard", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// -------------------------
// Authentication
// -------------------------

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Demo Credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        req.session.loggedIn = true;

        req.session.user = {
            username: "admin",
            role: "Administrator",
            loginTime: new Date().toLocaleString()
        };

        return res.json({
            success: true,
            message: "Login Successful"
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid Username or Password"
    });

});

// Logout

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

// Check Login Status

app.get("/api/user", isAuthenticated, (req, res) => {

    res.json({

        loggedIn: true,

        user: req.session.user

    });

});

// -------------------------
// Booking APIs (Protected)
// -------------------------

// Get All Bookings
app.get("/api/bookings", isAuthenticated, (req, res) => {

    const db = readDatabase();

    res.json(db.bookings);

});

// Add Booking
app.post("/api/bookings", isAuthenticated, (req, res) => {

    const db = readDatabase();

    const booking = {

        id: Date.now(),

        name: req.body.name,

        phone: req.body.phone,

        destination: req.body.destination,

        travellers: req.body.travellers,

        travelDate: req.body.travelDate,

        status: "Confirmed",

        amount: req.body.amount || 0,

        createdAt: new Date().toLocaleString()

    };

    db.bookings.push(booking);

    writeDatabase(db);

    res.json({

        success: true,

        message: "Booking Created Successfully",

        booking

    });

});

// Update Booking
app.put("/api/bookings/:id", isAuthenticated, (req, res) => {

    const db = readDatabase();

    const booking = db.bookings.find(
        b => b.id == req.params.id
    );

    if (!booking) {

        return res.status(404).json({

            success: false,

            message: "Booking Not Found"

        });

    }

    booking.name = req.body.name || booking.name;

    booking.phone = req.body.phone || booking.phone;

    booking.destination =
        req.body.destination || booking.destination;

    booking.travellers =
        req.body.travellers || booking.travellers;

    booking.travelDate =
        req.body.travelDate || booking.travelDate;

    writeDatabase(db);

    res.json({

        success: true,

        message: "Booking Updated"

    });

});

// Cancel Booking
app.patch("/api/bookings/:id/cancel", isAuthenticated, (req, res) => {

    const db = readDatabase();

    const booking = db.bookings.find(
        b => b.id == req.params.id
    );

    if (!booking) {

        return res.status(404).json({

            success: false,

            message: "Booking Not Found"

        });

    }

    booking.status = "Cancelled";

    writeDatabase(db);

    res.json({

        success: true,

        message: "Booking Cancelled"

    });

});

// Delete Booking
app.delete("/api/bookings/:id", isAuthenticated, (req, res) => {

    const db = readDatabase();

    db.bookings = db.bookings.filter(

        b => b.id != req.params.id

    );

    writeDatabase(db);

    res.json({

        success: true,

        message: "Booking Deleted"

    });

});

// Dashboard Statistics
app.get("/api/stats", isAuthenticated, (req, res) => {

    const db = readDatabase();

    const totalBookings = db.bookings.length;

    const confirmed = db.bookings.filter(

        b => b.status === "Confirmed"

    ).length;

    const cancelled = db.bookings.filter(

        b => b.status === "Cancelled"

    ).length;

    const revenue = db.bookings.reduce(

        (sum, booking) => sum + Number(booking.amount || 0),

        0

    );

    res.json({

        totalBookings,

        confirmed,

        cancelled,

        revenue

    });

});

// Recent Bookings
app.get("/api/recent-bookings", isAuthenticated, (req, res) => {

    const db = readDatabase();

    const recent = [...db.bookings]

        .reverse()

        .slice(0, 5);

    res.json(recent);

});

// Health Check
app.get("/health", (req, res) => {

    res.json({

        status: "UP",

        application: "TravelGo",

        version: "2.1.0",

        timestamp: new Date()

    });

});

// -------------------------
// 404 Handler
// -------------------------

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Page Not Found"

    });

});

// -------------------------
// Start Server
// -------------------------

app.listen(PORT, () => {

    console.log(`✅ TravelGo Server Running on Port ${PORT}`);

});
