const express = require("express");
const router = express.Router();
const { addProperty, getFeaturedProperties, getProperties, getMyProperties, updateMyProperty, deleteMyProperty, getPropertyDetails, addReview, getReviews, getMyRatings } = require("./../controllers/propertyController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

router.post("/add-properties", verifyFirebaseToken, addProperty);
router.get("/get-featured-properties", getFeaturedProperties);
router.get("/get-properties", getProperties);
router.get("/get-my-properties", verifyFirebaseToken, getMyProperties);
router.get("/get-property-details/:id", verifyFirebaseToken, getPropertyDetails);
router.patch("/update-my-property/:id", verifyFirebaseToken, updateMyProperty);
router.delete("/delete-my-property/:id", verifyFirebaseToken, deleteMyProperty);
router.post("/add-review", addReview);
router.get("/get-reviews/:id", getReviews);
router.get("/get-my-ratings", verifyFirebaseToken, getMyRatings)

module.exports = router;