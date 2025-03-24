import express from "express";
import { getProfile, updateProfile, getPreferences, updatePreferences } from "../controller/user.controller.js"; // Import your userController
import { validateToken } from "../utils/generate.js"; // Import your validateToken function

const router = express.Router();


router.use(validateToken);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Preferences routes
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

export default router;