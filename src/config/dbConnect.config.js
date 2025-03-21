import mongoose from "mongoose";

const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => {
            console.log("There is issue while connecting with database :: ", error);
            process.exit(1);
        });
}

export { dbConnect };