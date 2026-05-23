const express = require("express");
const router = express.Router();
const { addProperty, getFeaturedProperties, getProperties, getMyProperties, updateMyProperty } = require("./../controllers/propertyController");

router.post("/add-properties", addProperty);
router.get("/get-featured-properties", getFeaturedProperties);
router.get("/get-properties", getProperties);
router.get("/get-my-properties", getMyProperties);
router.patch("/update-my-property/:id", updateMyProperty);

module.exports = router;
