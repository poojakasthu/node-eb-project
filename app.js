const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello Project Working");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});