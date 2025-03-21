import { Router } from "express";
import { getAllUsers, getSingleUser, deleteUser, updateUser } from "../controller/user.controller.js";
import { auth, isAdmin } from "../middleware/auth.middleware.js";

const route = Router();

route.get("/", auth, getAllUsers);
route.get("/:id", auth, getSingleUser);
route.delete("/:id", auth, deleteUser);
route.put("/:id", auth, updateUser);

// For admin only
route.get("/admin/:id", auth, isAdmin, getSingleUser);
route.delete("/admin/:id", auth, isAdmin, deleteUser);
route.put("/admin/:id", auth, isAdmin, updateUser);

export { route as userRoute };