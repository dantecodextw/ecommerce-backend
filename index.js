import express from "express"
import "dotenv/config"
import mongoose from "mongoose";
import router from "./src/routes/userRoutes.js";
const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("server is listening on port:", port)
    })
})
app.use("/api/v1/", router)
app.use((err, req, res, next) => {
    console.log(err.statusCode, 'dfjgkidfhgkluidfhgkuidhfg')
    const status = err.status || "Something went wrong";
    const msg = err.message || "Something went wrong";
    console.log("msg:", msg)
    res.status(err.statusCode).json({ status, msg, stack: err.stack });
});

