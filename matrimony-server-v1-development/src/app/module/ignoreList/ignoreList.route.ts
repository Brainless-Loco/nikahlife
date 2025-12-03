// ignore.route.ts
import express from "express";
import { IgnoreController } from "./ignoreList.controller";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";

const router = express.Router();

router.post("/", checkAuth(USER_ROLE.USER), IgnoreController.ignoreUser);
router.get("/", checkAuth(USER_ROLE.USER), IgnoreController.getIgnoredUsers);
router.delete("/unignore", checkAuth(USER_ROLE.USER), IgnoreController.unignoreUser);


export const IgnoreRoutes = router;
