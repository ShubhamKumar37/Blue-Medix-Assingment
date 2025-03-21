import { Router } from "express";
import { getAllUsers, getSingleUser, deleteUser, updateUser } from "../controller/user.controller.js";
import { auth, isAdmin } from "../middleware/auth.middleware.js";

const route = Router();

route.get("/", auth, getAllUsers); // Working
route.get("/:id", auth, getSingleUser); // Working
route.delete("/:id", auth, deleteUser); // Working
route.put("/:id", auth, updateUser); // Working

// For admin only
route.delete("/admin/:id", auth, isAdmin, deleteUser); // Working
route.put("/admin/:id", auth, isAdmin, updateUser); // Working

export { route as userRoute };