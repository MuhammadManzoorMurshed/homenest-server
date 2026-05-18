const { insertProperty } = require("./../models/PropertyModel");

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

module.exports = { addProperty };