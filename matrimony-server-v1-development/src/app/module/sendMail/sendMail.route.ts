// src/app/modules/mail/mail.routes.ts
import express from "express";
import { MailController } from "./sendMail.controller";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";

const router = express.Router();

router.post("/send-single", checkAuth(USER_ROLE.ADMIN), MailController.sendMailToUser);
router.post("/send-all", checkAuth(USER_ROLE.ADMIN), MailController.sendMailToAll);
router.get("/", checkAuth(USER_ROLE.ADMIN), MailController.getAllMails);

export const MailRoutes = router;
