import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnect.config.js";
import cookieParser from "cookie-parser";
import { authRoute } from "./route/auth.route.js";
import { userRoute } from "./route/user.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

dotenv.config({ path: "./.env" })

dbConnect();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

// app.use(errorMiddleware);
app.listen(process.env.PORT, () => { console.log(`Server is started on this url = http://localhost:${process.env.PORT}`) });

app.get("/", (_, res) => {
    res.send("Hi i am a server who is working fine");
});