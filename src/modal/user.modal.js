import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "isSeller",
        enum: ["isSeller", "isCustomer", "isAdmin"]
    },
    passwordToken: { type: String },
    passwordTokenExpiry: { type: Date },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPassCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

export const User = mongoose.models.User || mongoose.model("User", userSchema);
