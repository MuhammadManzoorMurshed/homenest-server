require("dotenv").config();
const { connectDatabase } = require("./src/config/db.js");
const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./src/routes/propertyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://homenestbd-77ad7.web.app",
        "https://homenestbd-77ad7.firebaseapp.com",
    ],
    credentials: true,
}));

app.use(express.json());

let isConnected = false;

const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDatabase();
        isConnected = true;
    }
};

app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        console.log("DB connection failed: ", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed!",
        });
    }
});

app.use("/api/v1/", propertyRoutes);

app.get("/", (req, res) => {
    res.send("Ok");
})

if (process.env.NODE_ENV !== "production") {
    connectDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
}

module.exports = app;