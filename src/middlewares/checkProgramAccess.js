// middlewares/checkProgramAccess.js
import { getSetting } from "../utils/settings.js";

export const checkProgramAccess = async (req, res, next) => {
  const access = await getSetting("program_access");

  if (access === "auth" && !req.user) {
    return res.status(401).json({
      error: "Bu sayfa sadece giriş yapanlara açıktır",
    });
  }

  next();
};

export const checkFavoriAccess = async (req, res, next) => {
  const access = await getSetting("favori_access");

  if (access === "auth" && !req.user) {
    return res.status(401).json({
      error: "Favoriler sadece giriş yapanlara açıktır",
    });
  }

  next();
};
