import express from "express";
const router = express.Router();
import authenticateToken from "../middlewares/authMiddleware.js";
import History from "../models/History.js";

// GET historique de l'utilisateur
router.get("/", authenticateToken, async (req, res) => {
  try {
    const history = await History.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]]
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST une action personnalisée
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    if (!action) return res.status(400).json({ error: "Le champ 'action' est requis" });

    const historyEntry = await History.create({
      action,
      details: details || null,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      UserId: req.user.id
    });

    res.status(201).json(historyEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
