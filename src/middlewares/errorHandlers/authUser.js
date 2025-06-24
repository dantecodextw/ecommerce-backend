import token from "../../utils/accesToken/token.js";
import CustomError from "./customErrorHandler.js";
const islogedin = async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError("token not found", 404)
    let token = req.headers.authorization.split(' ')[1]
    let decodedData = token.verifyToken(token)
    req.data = decodedData;
    next();
}
const isAuthorized = async (req, res, next) => {
    if ((req.data.role === "seller")) return true;
    next();
}