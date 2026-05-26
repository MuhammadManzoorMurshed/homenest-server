require("dotenv").config();
const {connectDatabase} = require("./src/config/db.js"); 
const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./src/routes/propertyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const startServer = async () =>{
    await connectDatabase();

    app.use("/api/v1", propertyRoutes);

// =================================================================

    app.get("/", (req, res) => {
        res.send("Ok");
    })

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();