const { insertProperty, collectFeaturedProperties, collectProperties, collectMyProperties, changeMyProperty } = require("./../models/PropertyModel");

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
        const sortedDesc = { price: 1 };
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

        const cursor = collectProperties(limit, projectFields, sortedDesc);
        const properties = await cursor.toArray();

        res.status(200).json({
            success: true,
            message: "Properties retrieved successfully!",
            data: properties,
        });

        console.log("Properties retrieved: ", properties);
    } catch (error) {
        console.log("Error getting property: ", error);
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
    }
}

module.exports = { addProperty, getProperties, getFeaturedProperties, getMyProperties, updateMyProperty };