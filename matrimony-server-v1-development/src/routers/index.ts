import { Router } from "express";
import { UserRoutes } from "../app/module/user/user.route";
import { BiodataRoutes } from "../app/module/biodata/biodata.route";
import { sendOtp, verifyOtp } from "../app/controllers/OTPSend";
import { paymentRoutes } from "../app/module/payment/payment.route";
import { Interest } from "../app/module/interest/interest.route";
import { AuthRoutes } from "../app/module/auth/auth.route";
import { subscriptionRoutes } from "../app/module/subscription/subscription.route";
import { IgnoreRoutes } from "../app/module/ignoreList/ignoreList.route";
import profileVisitRoutes from "../app/module/contactVisitCount/contactVisit.route";
import { MailRoutes } from "../app/module/sendMail/sendMail.route";
import { ReviewRoutes } from "../app/module/review/review.route";
import { SpecialOfferRoutes } from "../app/module/specialOffers/specialOffer.route";
import { newslatterSubscriber } from "../app/module/newslatterSubscriber/newslatterSubscriber.route";
import { ContactRoutes } from "../app/module/contactUs/contactUs.route";
import { ShortlistRoutes } from "../app/module/shortList/shortList.route";



const router = Router();

const moduleROuters = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/biodata",
    route: BiodataRoutes,
  },

  {
    path: "/send-otp",
    route: sendOtp,
  },
  {
    path: "/verify-otp",
    route: verifyOtp,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/interest",
    route: Interest,
  },
  {
    path: "/subscription",
    route: subscriptionRoutes,
  },
  {
    path: "/ignore",
    route: IgnoreRoutes,
  },
  {
    path: "/contact-visit",
    route: profileVisitRoutes,
  },
  {
    path: "/mail",
    route: MailRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/special-offers",
    route: SpecialOfferRoutes,
  },
  {
    path: "/subscriber",
    route: newslatterSubscriber,
  },
  {
    path:"/contactUs",
    route: ContactRoutes
  },
  {
      path:"/shortList",
    route: ShortlistRoutes  }

];
moduleROuters.forEach((route) => router.use(route.path, route.route));
export default router;
