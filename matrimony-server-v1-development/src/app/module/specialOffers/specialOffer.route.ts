import express from "express";
import checkAuth from "../../../middlewares/checkAuth";
import { SpecialOfferController } from "./specialOffer.controller";
import { USER_ROLE } from "../../../types/global";


const router = express.Router();


router.post(
  "/",
  checkAuth(USER_ROLE.ADMIN),
  SpecialOfferController.createOffer
);


router.get("/", SpecialOfferController.getAllOffers);

router.delete(
  "/:id",
  checkAuth(USER_ROLE.ADMIN),
  SpecialOfferController.deleteOffer
);

export const SpecialOfferRoutes = router;
