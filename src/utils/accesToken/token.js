import jwt from "jsonwebtoken"
let key = process.env.SECRET_KEY
function genToken(data) {
    let token = jwt.sign({ data }, key)
    return jwt.sign({ id: data._id, role: data.role })
}
function verifyToken(token) {
    return jwt.verify(token, key)
}
export default { verifyToken, genToken };