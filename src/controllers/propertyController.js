const { ObjectId } = require("mongodb");
const { insertProperty, collectFeaturedProperties, collectProperties, collectMyProperties, collectPropertyDetails, changeMyProperty, removeMyProperty, insertReview, collectReviews, collectMyRatings } = require("./../models/PropertyModel");

const addProperty = async (req, res) => {
    console.log(req.body.price, typeof req.body.price);
    try {
        const property = {
            ...req.body,
            createdAt: new Date(),
        }

        const result = await insertProperty(property);

        res.status(201).json({
            success: true,
            message: "Property added successfully!",
            propertyId: result.insertedId,
        })
    } catch (error) {
        console.error("Error adding property: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to add property. Please try again.",
        })
    }
}

const getFeaturedProperties = async (req, res) => {
    try {
        const sortedDesc = { createdAt: -1 };
        const limit = 6;
        const projectFields = {
            listingPurpose: 1,
            firstImage: {
                $arrayElemAt: ["$images", 0],
            },
            propertyName: 1,
            city: "$location.city",
            thana: "$location.thana",
            propertyType: 1,
            name: "$contact.name",
            price: 1,
        };

        const cursor = collectFeaturedProperties(sortedDesc, limit, projectFields);
        const featuredProperties = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "Featured properties retrieved successfully!",
            data: featuredProperties,
        })
    }
    catch (error) {
        console.log("Error getting featured properties: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve featured properties. Please try again.",
            data: [],
        })
    }
}

const getProperties = async (req, res) => {
    try {
        const search = req.query.search;
        const sort = req.query.sort;
        const filter = search ? {
            propertyName: {
                $regex: search,
                $options: "i"
            }
        } : {};
        let sorted = sort === 'price-asc' ? { price: 1 } : sort === 'price-desc' ? { price: -1 } : {createdAt: -1};
        console.log(sorted);
        const limit = 12;
        const projectFields = {
            listingPurpose: 1,
            firstImage: {
                $arrayElemAt: ["$images", 0],
            },
            propertyName: 1,
            city: "$location.city",
            thana: "$location.thana",
            propertyType: 1,
            name: "$contact.name",
            price: 1,
        };

        const cursor = collectProperties(limit, projectFields, sorted, filter);
        const properties = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "Properties retrieved successfully!",
            data: properties,
        });
    } catch (error) {
        console.log("Error getting property: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve property. Please try again.",
            data: []
        })
    }
}

const getMyProperties = async (req, res) => {
    try {
        const filter = { "contact.email": req.query.email };
        const sortedDesc = { createdAt: -1 };
        const limit = 12;
        const projectFields = {
            listingPurpose: 1,
            images: 1,
            propertyName: 1,
            description: 1,
            location: 1,
            propertyType: 1,
            contact: 1,
            price: 1,
        };

        const cursor = collectMyProperties(filter, sortedDesc, limit, projectFields);
        const myProperties = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "My properties retrieved successfully!",
            data: myProperties,
        });
    }
    catch (error) {
        console.log("Error getting my properties: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve your properties. Please try again.",
            data: [],
        })
    }
}

const  getPropertyDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const fileter = { _id: new ObjectId(id) };

        const propertyDetails = await collectPropertyDetails(fileter);

        res.status(200).json({
            success: true,
            message: "Property details retrieved successfully!",
            data: propertyDetails,
        })
    }
    catch(error) {
        console.log("Error getting property details: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve property details. Please try again.",
            data: [],
        })
    }
}

const updateMyProperty = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedMyProperty = req.body;

        const result = await changeMyProperty(id, updatedMyProperty);

        res.status(200).json({
            success: true,
            message: "Property updated successfully!",
            data: result,
        })
    }
    catch (error) {
        console.log("Error updating property: ", error);

        res.status(500).json({
            success: false,
            messate: "Error updating property",
            data: [],
        })
    }
}

const deleteMyProperty = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await removeMyProperty(id);

        if(result.deletedCount === 1) {
            res.status(200).json({
                success: true,
                message: "Property deleted successfully!",
                data: []
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Property not found",
                data: []
            })
        }
    } catch (error) {
        console.log("Error deleting property: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete property. Please try again.",
            data: [],
        })
    }
}

const addReview = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const propertyId = req.body.propertyId;
        const newReview = {
            ...req.body,
            propertyId: new ObjectId(req.body.propertyId),
            createdAt: new Date(),
        }

        const result = await insertReview(newReview, userEmail, propertyId);

        res.status(201).json({
            success: true,
            message: "Review added successfully!",
            data: result,
        })
    }
    catch(error) {
        console.log("Error adding review: ", error.message);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to add review. Please try again.",
            data: [],
        })

    }
}

const getReviews = async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { propertyId: id };

        const cursor = collectReviews(filter);
        const reviews = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully!",
            data: reviews,
        })
    } catch (error) {
        console.log("Error getting reviews: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve reviews. Please try again.",
            data: [],
        })
    }
}

const getMyRatings = async (req, res) => {
    try {
        const myEmail = req.query.email;
        const filter = { email: myEmail }

        const cursor = collectMyRatings(filter);
        const myRatings = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully!",
            data: myRatings,
        }) 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load ratings. Please try again.",
            data: [],
        })
    }
}

module.exports = { addProperty, getProperties, getFeaturedProperties, getMyProperties, getPropertyDetails, updateMyProperty, deleteMyProperty, addReview, getReviews, getMyRatings };