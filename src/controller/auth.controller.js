import { OTP } from "../modal/otp.modal.js";
import { User } from "../modal/user.modal.js";
import jwt from "jsonwebtoken";
import { asyncFun, ErrorHandler, mailSender, ResponseHandler } from "../util/index.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: Date.now() + 3 * 24 * 60 * 60 * 1000,
};

const checkEmail = (email) => email && email.trim().length !== 0;

const sendOTP = asyncFun(async (req, res) => {
    const { email } = req.body;

    if (!checkEmail(email)) throw new ErrorHandler(400, "Email is required or invalid", []);
    const otp = Math.floor(100000 + Math.random() * 900000);
    await OTP.create({ email, otp });

    return res.status(200).json(new ResponseHandler(200, "OTP has been sent to your email or spam folder", { otp }));
});

const registerUser = asyncFun(async (req, res) => {
    const { name, email, password, otp, role } = req.body;

    if (!name || !name.trim()) throw new ErrorHandler(400, "Name is required", []);
    if (!checkEmail(email)) throw new ErrorHandler(400, "Email is required or invalid", []);
    if (!password) throw new ErrorHandler(400, "Password is required", []);
    if (!otp || otp.length !== 6) throw new ErrorHandler(400, "OTP is required", []);
    if (!role || !role.trim()) throw new ErrorHandler(400, "Role is required and role can be (isAdmin, isCustomer, isSeller)", []);

    const otpExist = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpExist) throw new ErrorHandler(400, "Invalid OTP or OTP expired", []);

    const userExist = await User.findOne({ email });
    if (userExist) throw new ErrorHandler(400, "User already exist", []);

    const newUser = await User.create({ name, email, password, role });
    if (!newUser) throw new ErrorHandler(500, "Something went wrong may role is not valid", []);

    return res.status(200).json(new ResponseHandler(200, "User has been registered successfully, now login", newUser));

});

const loginUser = asyncFun(async (req, res) => {
    const { email, password } = req.body;

    if (!checkEmail(email)) throw new ErrorHandler(400, "Email is required", []);

    const userExist = await User.findOne({ email });
    if (!userExist) throw new ErrorHandler(400, "User does not exist", []);

    const isPassCorrect = await userExist.isPassCorrect(password);
    if (!isPassCorrect) throw new ErrorHandler(400, "Password is incorrect", []);

    const token = jwt.sign({
        _id: userExist._id,
        role: userExist.role,
        email: userExist.email
    }, process.env.JWT_SECRET, { expiresIn: "10h" });

    userExist.token = token;
    userExist.password = undefined;

    res.cookie("token", token, cookieOptions);
    return res.status(200).json(new ResponseHandler(200, "User has been logged in successfully", userExist));
});

const logoutUser = asyncFun(async (_, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res.status(200).json(new ResponseHandler(200, "User has been logged out successfully"));
});

const sendResetPasswordToken = asyncFun(async (req, res) => {
    const { email } = req.body;
    if (!checkEmail(email)) throw new ErrorHandler(400, "Email is required or invalid", []);

    const userExist = await User.findOne({ email });
    if (!userExist) throw new ErrorHandler(400, "User does not exist", []);

    const token = jwt.sign({
        _id: userExist._id,
    }, process.env.JWT_SECRET);

    userExist.passwordToken = token;
    userExist.passwordTokenExpiry = Date.now() + 60 * 60 * 1000;

    await userExist.save();
    await mailSender("Reset Password", email, `<a href="http://localhost:3000/reset-password/${token}">Click here to reset password</a>`);

    return res.status(200).json(new ResponseHandler(200, "Reset password link has been sent to your email", token));
});

const resetPassword = asyncFun(async (req, res) => {
    const { token, password } = req.body;

    if (!token || !token.trim()) throw new ErrorHandler(400, "Token is required", []);
    if (!password) throw new ErrorHandler(400, "Password is required", []);

    const userExist = await User.findOne({ passwordToken: token });
    if (!userExist) throw new ErrorHandler(400, "User does not exist", []);

    if (userExist.passwordTokenExpiry < Date.now()) throw new ErrorHandler(400, "Token has been expired", []);

    userExist.password = password;
    await userExist.save();

    return res.status(200).json(new ResponseHandler(200, "Password has been reset successfully now login"));
});


export { registerUser, loginUser, logoutUser, sendResetPasswordToken, resetPassword, sendOTP };