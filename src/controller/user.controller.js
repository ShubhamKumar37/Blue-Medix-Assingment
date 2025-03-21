import { User } from "../modal/user.modal.js";
import { asyncFun, ErrorHandler, ResponseHandler } from "../util/index.js";

const getAllUsers = asyncFun(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit);
    return res.status(200).json(new ResponseHandler(200, "All users", users));
});

const getSingleUser = asyncFun(async (req, res) => {
    const { id } = req.params;

    const userExist = await User.findById(id).select("-password");
    if (!userExist) throw new ErrorHandler(404, "User does not exist", []);

    return res.status(200).json(new ResponseHandler(200, "Single user fetched successfully", userExist));
});

const deleteUser = asyncFun(async (req, res) => {
    const { id } = req.params;
    const { role, _id } = req.user;

    if (role !== "isAdmin") {
        const isUserYou = await User.findById(id);
        if (!isUserYou) throw new ErrorHandler(404, "User does not exist", []);
        if (isUserYou._id.equals(_id)) throw new ErrorHandler(401, "You are not allowed to delete someone else account");
    }
    const userExist = await User.findByIdAndDelete(id);
    if (!userExist) throw new ErrorHandler(404, "User does not exist", []);

    return res.status(200).json(new ResponseHandler(200, "User has been deleted successfully", userExist));
})

const updateUser = asyncFun(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const { role, _id } = req.user;

    if (!name || !name.trim()) throw new ErrorHandler(404, "Please provide a updating name");

    if (role !== "isAdmin") {
        const isUserYou = await User.findById(id);
        if (!isUserYou) throw new ErrorHandler(404, "User does not exist", []);
        if (isUserYou._id.equals(_id)) throw new ErrorHandler(401, "You are not allowed to delete someone else account");
    }

    const userExist = await User.findByIdAndUpdate(id, { name }, { new: true }).select("-password");
    if (!userExist) throw new ErrorHandler(404, "User does not exist", []);

    return res.status(200).json(new ResponseHandler(200, "User has been updated successfully", userExist));
})

export { getAllUsers, getSingleUser, deleteUser, updateUser };