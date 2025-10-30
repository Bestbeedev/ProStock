import express from "express";
const router = express.Router();
import cartController from "../controllers/cartController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

router.post("/add", authenticateToken, cartController.addToCart);
router.get("/", authenticateToken, cartController.getCart);
router.post("/checkout", authenticateToken, cartController.checkout);

export default router;
