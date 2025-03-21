import { asyncFun, ErrorHandler } from "../util/index.js";
import jwt from "jsonwebtoken";

const auth = asyncFun(async (req, _, next) => {
    const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

    if (!token) throw new ErrorHandler(401, "Please login first", []);

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) throw new ErrorHandler(403, "Your are not authorized please try login again ", []);

    req.user = decodedData;
    console.log("this is token info ", req.user);
    next();
});

const isAdmin = asyncFun(async (req, _, next) => {
    const { role } = req.user;
    if (role !== "isAdmin") throw new ErrorHandler(403, "You are not an admin", []);
    next();
});

export { isAdmin, auth };