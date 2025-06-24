import { Router } from "express";
import userController from "../controllers/userController.js";
const router = Router();
router.route('/auth/register').post(userController.register)
export default router;
