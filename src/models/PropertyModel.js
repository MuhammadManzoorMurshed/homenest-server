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

const collectProperties = (limit, projectFields, sort) => {
    const database = getDatabase();

    const cursor = database.collection("properties").find().sort(sort).limit(limit).project(projectFields);

    return cursor;
}

const collectMyProperties = (filter, sortedDesc, limit, projectFields) => {
    const database = getDatabase();

    const cursor = database.collection("properties").find(filter).limit(limit).sort(sortedDesc).project(projectFields);

    return cursor;
}

const changeMyProperty = async (id, updatedMyProperty) => {
    const database = getDatabase();

    const result = await database.collection("properties").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: {...updatedMyProperty, updatedAt: new Date() } },
        { returnDocument: "after" }
    )

    return result;
}

module.exports = { insertProperty, collectFeaturedProperties, collectProperties, collectMyProperties, changeMyProperty };