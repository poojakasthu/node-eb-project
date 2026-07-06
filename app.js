const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "data", "database.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function readDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(
            DB_PATH,
            JSON.stringify({ bookings: [] }, null, 2)
        );
    }

    return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get All Bookings
app.get("/api/bookings", (req, res) => {
    const db = readDatabase();
    res.json(db.bookings);
});

// Create Booking
app.post("/api/bookings", (req, res) => {

    const db = readDatabase();

    const booking = {
        id: Date.now(),
        name: req.body.name,
        destination: req.body.destination,
        travellers: req.body.travellers,
        travelDate: req.body.travelDate,
        phone: req.body.phone,
        status: "Confirmed",
        createdAt: new Date().toLocaleString()
    };

    db.bookings.push(booking);

    writeDatabase(db);

    res.json({
        success: true,
        message: "Booking Successful",
        booking
    });

});

// Delete Booking
app.delete("/api/bookings/:id", (req, res) => {

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

// Statistics
app.get("/api/stats", (req, res) => {

    const db = readDatabase();

    res.json({
        totalBookings: db.bookings.length,
        confirmed: db.bookings.filter(
            b => b.status === "Confirmed"
        ).length,
        cancelled: db.bookings.filter(
            b => b.status === "Cancelled"
        ).length
    });

});

// 404 Page
app.use((req, res) => {
    res.status(404).json({
        error: "Page Not Found"
    });
});

app.listen(PORT, () => {
    console.log(`TravelGo Server Running on Port ${PORT}`);
});
