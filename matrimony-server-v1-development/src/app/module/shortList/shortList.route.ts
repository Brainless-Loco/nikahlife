import express from "express";
import { ShortlistController } from "./shortList.controller";
import checkAuth from "../../../middlewares/checkAuth";
import { USER_ROLE } from "../../../types/global";


const router = express.Router();

// POST: add to shortlist
router.post("/:id", checkAuth(USER_ROLE.USER), ShortlistController.addShortlist);

// GET: get user shortlist
router.get("/", checkAuth(USER_ROLE.USER), ShortlistController.getUserShortlists);

export const ShortlistRoutes = router;
