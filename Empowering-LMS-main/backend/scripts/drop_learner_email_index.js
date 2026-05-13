const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.collection("learners");

        // Check existing indexes
        const indexes = await collection.indexes();
        console.log("Current indexes:", indexes);

        // Drop email_1 index
        const indexName = "email_1";
        if (indexes.find(idx => idx.name === indexName)) {
            await collection.dropIndex(indexName);
            console.log(`Index ${indexName} dropped successfully.`);
        } else {
            console.log(`Index ${indexName} not found.`);
        }

        // Ensure new compound index is created (Mongoose auth-syncs usually, but forcing sync is good)
        // Actually, restarting the server will handle the creation of the new index defined in the schema.

        await mongoose.disconnect();
        console.log("Disconnected");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

dropIndex();
