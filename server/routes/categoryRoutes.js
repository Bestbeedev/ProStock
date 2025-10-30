import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadmiddleware.js";

router.post("/", authenticateToken, upload.single("image"), categoryController.createCategory);
router.get("/", authenticateToken, categoryController.getCategories);
router.get("/:id", authenticateToken, categoryController.getCategoryById);
router.put("/:id", authenticateToken, upload.single("image"), categoryController.updateCategory);
router.delete("/:id", authenticateToken, categoryController.deleteCategory);

export default router;
