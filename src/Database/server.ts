import mongoose from "mongoose";
import { DB_NAME } from "../constant"

const ConnectDB: () => Promise<void> = async () => {
    try {
        // Remove the slash before ${DB_NAME}
        const Connection = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
        console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
        console.log(`📍 Host: ${Connection.connection.host}`);
    } catch (error: any) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export { ConnectDB }
