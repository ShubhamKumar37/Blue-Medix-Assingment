import { registerUser, loginUser, logoutUser, sendResetPasswordToken, resetPassword, sendOTP } from "../controller/auth.controller.js";
import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";

const route = Router();

// Working

route.post("/", registerUser);
route.put("/", loginUser);
route.post("/logout", logoutUser);
route.put("/send-password-token", sendResetPasswordToken);
route.put("/reset-password", resetPassword);
route.post("/send-otp", sendOTP);

export { route as authRoute };