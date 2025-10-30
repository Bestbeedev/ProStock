import History from "../models/History.js";

/**
 * Logger une action utilisateur
 * @param {string} action - Nom de l'action
 */
const logAction = (action) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"] || "unknown";

      if (req.user) { // si utilisateur connecté
        await History.create({
          action,
          details: JSON.stringify(req.body),
          ipAddress: ip,
          userAgent,
          UserId: req.user.id
        });
      }
    } catch (err) {
      console.error("Erreur loggerMiddleware:", err.message);
    }
    next();
  };
};

export default logAction;
