import mongoose from "mongoose";

export default async function startDb() {
  try {
    await mongoose.connect(process.env.MONGO_ENDPOINT!, {});
    console.log(`database connected and running...`);
  } catch (error:any) {
    console.log(`database error: ${error.message}`)
    throw error;
  }
}