import express from "express";
import { USER_ROLE } from "../../../types/global";
import { InterestControllers } from "./intereset.controller";
import auth from "../../../middlewares/checkAuth";


const router = express.Router();

router.post("/send", auth(USER_ROLE.USER), InterestControllers.sendInterest);
router.patch("/cancel/:receiverId", auth(USER_ROLE.USER), InterestControllers.cancelInterest);
router.get("/sent", auth(USER_ROLE.USER), InterestControllers.getSentInterests);
router.get("/received", auth(USER_ROLE.USER), InterestControllers.getReceivedInterests);

export const Interest = router;
