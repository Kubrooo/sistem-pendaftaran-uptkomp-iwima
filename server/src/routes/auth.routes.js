import { Router } from "express";
import {
  loginAdmin,
  loginApplicant,
  me,
  registerApplicant,
  changePassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { uploadMultiplePdf } from "../middleware/upload.js";

const router = Router();

router.post("/register", uploadMultiplePdf, registerApplicant);
router.post("/login", loginApplicant);
router.post("/admin/login", loginAdmin);
router.get("/me", authenticate, me);
router.put("/change-password", authenticate, changePassword);

export default router;
