import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  listApplicants,
  updateApplicant,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authenticate, requireRole("admin"));
router.get("/applicants", listApplicants);
router.put("/applicants/:id", updateApplicant);

export default router;
