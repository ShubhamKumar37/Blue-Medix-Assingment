import mongoose from "mongoose";
import { mailSender } from "../util/index.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "5m",
    }
});

async function sendOTPEmail(email, otp) {
    try {
        await mailSender("OTP", email, `Your OTP is ${otp}`);
    }
    catch (error) {
        console.log("There is issue while sending otp email :: ", error);
    }
}

OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendOTPEmail(this.email, this.otp);
    }
    next();
});

export const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
