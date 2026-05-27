const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");

const insertProperty = async (property) => {
    const database = getDatabase();

    return await database.collection("properties").insertOne(property);
}

const collectFeaturedProperties = (sortedDesc, limit, projectFields) => {
    const database = getDatabase();

    const cursor = database.collection("properties").find().sort(sortedDesc).limit(limit).project(projectFields);

    return cursor;
}

const collectProperties = (limit, projectFields, sort, filter) => {
    const database = getDatabase();

    const cursor = database.collection("properties").find(filter).sort(sort).limit(limit).project(projectFields);

    return cursor;
}

const collectMyProperties = (filter, sortedDesc, limit, projectFields) => {
    const database = getDatabase();

    const cursor = database.collection("properties").find(filter).limit(limit).sort(sortedDesc).project(projectFields);

    return cursor;
}

const collectPropertyDetails = (filter) => {
    const database = getDatabase();

    const cursor = database.collection("properties").findOne(filter);

    return cursor;
}

const changeMyProperty = async (id, updatedMyProperty) => {
    const database = getDatabase();

    const result = await database.collection("properties").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updatedMyProperty, updatedAt: new Date() } },
        { returnDocument: "after" }
    )

    return result;
}

const insertReview = async (review, userEmail, propertyId) => {
    const database = getDatabase();

    const isReviewExists = await database.collection("reviews").findOne({
        email: userEmail,
        propertyId: new ObjectId(propertyId),
    })

    if (isReviewExists) {
        throw new Error("You have already reviewed this property. You cannot add multiple reviews for the same property.");
    }

    const result = await database.collection("reviews").insertOne(review);

    return result;

}

const collectReviews = (filter) => {
    const database = getDatabase();

    const cursor = database.collection("reviews").find(filter).sort({ createdAt: -1 });

    return cursor;
}

const collectMyRatings = (filter) => {
    const database = getDatabase();

    const cursor = database
        .collection('reviews')
        .aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'propertyId',
                    foreignField: '_id',
                    as: 'property',
                }
            },
            {
                $unwind: '$property'
            },
            {
                $project: {
                    images: '$property.images',
                    propertyName: '$property.propertyName',
                    rating: 1,
                    comment: 1,
                    userName: 1,
                    userPhoto: 1,
                    createdAt: 1,
                }
            }
        ]);

    return cursor;
}

module.exports = { insertProperty, collectFeaturedProperties, collectProperties, collectMyProperties, collectPropertyDetails, changeMyProperty, insertReview, collectReviews, collectMyRatings };