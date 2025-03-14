import mongoose from "mongoose";
const connection = {};
async function connectDb() {
    if (connection.isConnected) {
        console.log("Already connected to the database")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {} )
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database")
    } catch (error) {
        console.log("Database connection failed", error)
    }
}

export default connectDb;