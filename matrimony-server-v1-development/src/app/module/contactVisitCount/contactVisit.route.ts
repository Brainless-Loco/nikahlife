import express from "express";
import { ProfileVisitController } from "./contactVisit.controller";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";

const router = express.Router();

router.post(
  "/:profileId",
  checkAuth(USER_ROLE.USER),
  ProfileVisitController.viewContactInfo
);
router.get(
  "/contact-view-status",
  checkAuth(USER_ROLE.USER),
  ProfileVisitController.getProfileViewStatus
);

const profileVisitRoutes = router;

export default profileVisitRoutes;
