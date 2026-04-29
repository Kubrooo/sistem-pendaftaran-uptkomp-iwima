import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { myStatus } from "../controllers/applicant.controller.js";

const router = Router();

router.get("/my-status", authenticate, requireRole("applicant"), myStatus);

export default router;
