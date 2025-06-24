import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js"
import userServices from "../services/userService.js"
const register = asyncErrorHandler(async (req, res, next) => {

    console.log("register controller provoked:", req.body)

    let info = await userServices.registerUser(req.body)

    console.log("info from register controller:", info)

    res.status(info.status).json(info)
})
export default { register }