const express = require("express");
const router = express.Router();
const {addProperty} = require("./../controllers/propertyController");

router.post("/add-properties", addProperty);

module.exports = router;