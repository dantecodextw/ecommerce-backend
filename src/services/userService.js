import CustomError from "../middlewares/errorHandlers/customErrorHandler.js"
import User from "../models/userModel.js"
import token from "../utils/accesToken/token.js"
import sendMail from "../utils/mailer.js";
const registerUser = async (info) => {
    console.log("user service invoked:", info);
    const existingUser = await User.findOne({ email: info.email });
    if (existingUser) {
        throw new CustomError("User with this email already exists", 400);
    }
    const newUser = await User.create({ ...info });
    return {
        ...newUser.toObject(),
        status: 200,
        msg: "User registered successfully",
    };
};
const loginUser = async (info) => {
    let user = await User.findOne({ email: info.email })
    if (!user) throw new CustomError('user with this email does not exist', 400)
    let chkPassword = await user.comparePassword(info.password)
    if (!chkPassword) throw new CustomError("incorect password", 400)
    let newToken = token.genToken(user)
    return {
        status: 200,
        msg: 'user logedin succesfully',
        token: newToken
    }
}

export default { registerUser, loginUser };