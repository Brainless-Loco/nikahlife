import express from "express";
import { ContactController } from "./contactUs.controller";

const router = express.Router();

router.post("/", ContactController.sendContactMessage);

export const ContactRoutes = router;
