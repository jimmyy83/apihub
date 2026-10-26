import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import logger from "../logger/winston.logger.js";

/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const connectDB = async () => {
  try {
    // Pass the db name as an option so URIs that already carry a path or query (e.g. `/admin?authSource=admin`) keep working
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });
    dbInstance = connectionInstance;
    logger.info(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    logger.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
