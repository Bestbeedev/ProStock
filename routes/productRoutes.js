import express from "express";
const router = express.Router();
import productController from "../controllers/productController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadmiddleware.js";

router.post("/", authenticateToken, upload.single("image"), productController.createProduct);
router.get("/", authenticateToken, productController.getProducts);
router.get("/:id", authenticateToken, productController.getProductById);
router.put("/:id", authenticateToken, upload.single("image"), productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);

export default router;
