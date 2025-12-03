import express from "express";
import { SubscriptionControllers } from "./subscription.controller";
import { USER_ROLE } from "../../../types/global";
import auth from "../../../middlewares/checkAuth";
import catchAsync from "../../../utils/catchAsync";


const router = express.Router();

router.post("/create", auth(USER_ROLE.USER), SubscriptionControllers.createSubscription);



// get all subscriptions - admin only
router.get("/all", auth(USER_ROLE.ADMIN), SubscriptionControllers.getAllSubscriptions);

// get single subscription by id - admin only
router.get("/:id", auth(USER_ROLE.ADMIN), catchAsync(SubscriptionControllers.getSubscriptionById));

// activate subscription after payment success (admin or payment callback)
router.patch("/activate/:id", auth(USER_ROLE.ADMIN), SubscriptionControllers.activateSubscription);

router.patch("/expire/:id", auth(USER_ROLE.ADMIN), SubscriptionControllers.expireSubscription);

export const subscriptionRoutes =  router;