import mongoose from "mongoose";

export default async function startDb() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_ENDPOINT!, {});
    return connection;
  } catch (error:any) {
    console.log(`database error: ${error.message}`)
    throw error;
  }
}