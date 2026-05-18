const {getDatabase} = require("../config/db");

const insertProperty = async (property) => {
    const database = getDatabase();

    return await database.collection("properties").insertOne(property);
}

module.exports = {insertProperty};