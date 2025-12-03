import { Router } from "express";
import { getAllSubscribers, subscribe } from "./newslatterSubscriber.controller";



const router = Router();


router.post("/", subscribe);
router.get("/", getAllSubscribers);

export const  newslatterSubscriber= router;
