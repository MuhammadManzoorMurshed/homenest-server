const express = require("express");
const router = express.Router();
const { addProperty, getFeaturedProperties, getProperties, getMyProperties, updateMyProperty, getPropertyDetails, addReview, getReviews, getMyRatings } = require("./../controllers/propertyController");

router.post("/add-properties", addProperty);
router.get("/get-featured-properties", getFeaturedProperties);
router.get("/get-properties", getProperties);
router.get("/get-my-properties", getMyProperties);
router.get("/get-property-details/:id", getPropertyDetails);
router.patch("/update-my-property/:id", updateMyProperty);

router.post("/add-review", addReview);
router.get("/get-reviews/:id", getReviews);
router.get("/get-my-ratings", getMyRatings)

module.exports = router;