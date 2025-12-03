import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { AuthUser } from "../app/module/user/user.interface";
import { envVars } from "./envConfig";
import User from "../app/module/user/user.model";
import Biodata from "../app/module/biodata/biodata.model";
import Payment from "../app/module/payment/payment.model";
import authLogger from "../utils/logger";

// Log passport initialization
authLogger.start("PASSPORT_INIT", "Initializing Google OAuth Strategy", {
  clientID: envVars.GOOGLE_CLIENT_ID ? "SET" : "NOT SET",
  clientSecret: envVars.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET",
  callbackURL: envVars.GOOGLE_CALLBACK_URL,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID!,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET!,
      callbackURL: envVars.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      authLogger.start("GOOGLE_STRATEGY", "Google Strategy verify callback started", {
        profileId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails?.map(e => e.value),
      });

      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          authLogger.error("GOOGLE_STRATEGY", "No email found in Google profile", { profile });
          return done(null, false, { message: "No email found" });
        }

        authLogger.info("GOOGLE_STRATEGY", "Email extracted from Google profile", { email });

        // Handle Google's name format: can be displayName or name.givenName + name.familyName
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const fullName = profile.displayName || `${firstName} ${lastName}`.trim() || "User";

        authLogger.info("GOOGLE_STRATEGY", "Name extracted from Google profile", { 
          firstName, 
          lastName, 
          fullName 
        });

        // Step 1: Check if user exists
        authLogger.info("GOOGLE_STRATEGY", "Checking if user exists in database", { email });
        let user = await User.findOne({ email });
        let isNewUser = false;
        
        if (!user) {
          // Step 2a: Create new user for Google sign-up (no password required)
          authLogger.info("GOOGLE_STRATEGY", "User not found, creating new user", { email, fullName });
          
          user = await User.create({
            name: fullName,
            email,
            role: "user",
            isVerified: true, // Google accounts are pre-verified
            agreeToPrivacy: true,
            agreeToTerms: true,
            isProfileCompleted: false,
            subscriptionType: "free",
          });
          isNewUser = true;
          
          authLogger.success("GOOGLE_STRATEGY", "New user created successfully", { 
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
          });
        } else {
          // Step 2b: User exists
          authLogger.info("GOOGLE_STRATEGY", "Existing user found", { 
            userId: user._id.toString(),
            email: user.email,
            isVerified: user.isVerified,
          });

          if (!user.isVerified) {
            // If user exists but not verified, verify them (Google is trusted)
            authLogger.info("GOOGLE_STRATEGY", "User not verified, verifying now", { email });
            user.isVerified = true;
            await user.save();
            authLogger.success("GOOGLE_STRATEGY", "User verified successfully", { email });
          }
        }

        // Step 3: Check if user has biodata
        authLogger.info("GOOGLE_STRATEGY", "Checking if user has biodata", { userId: user._id.toString() });
        const biodata = await Biodata.findOne({ userId: user._id.toString() });
        const hasBiodata = !!biodata;
        authLogger.info("GOOGLE_STRATEGY", "Biodata check complete", { hasBiodata });

        // Step 4: Get latest subscription type from payment
        authLogger.info("GOOGLE_STRATEGY", "Fetching subscription type from payments", { userId: user._id.toString() });
        const latestPayment = await Payment.findOne({ userId: user._id.toString() })
          .sort({ paymentDate: -1 })
          .lean();
        const subscriptionType = latestPayment?.subscriptionType || user.subscriptionType || "free";
        authLogger.info("GOOGLE_STRATEGY", "Subscription type determined", { subscriptionType });

        // Step 5: Create AuthUser object
        const authUser: AuthUser = {
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          hasBiodata,
          subscriptionType,
          isProfileCompleted: user.isProfileCompleted,
          isVerified: user.isVerified,
        };
        
        // Attach isNewUser flag for redirect logic
        (authUser as any).isNewUser = isNewUser;
        
        authLogger.success("GOOGLE_STRATEGY", "Google OAuth verification complete", {
          userId: authUser.userId,
          email: authUser.email,
          isNewUser,
          hasBiodata,
          subscriptionType,
        });

        done(null, authUser);
      } catch (err) {
        authLogger.error("GOOGLE_STRATEGY", "Google OAuth strategy error", err);
        done(err);
      }
    }
  )
);

authLogger.success("PASSPORT_INIT", "Google OAuth Strategy registered successfully");

passport.serializeUser((user: any, done) => {
  authLogger.debug("PASSPORT_SERIALIZE", "Serializing user", { userId: user.userId });
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done) => {
  authLogger.debug("PASSPORT_DESERIALIZE", "Deserializing user", { userId: id });
  
  const user = await User.findById(id);
  if (!user) {
    authLogger.warn("PASSPORT_DESERIALIZE", "User not found during deserialization", { userId: id });
    return done(null, null);
  }
  const authUser: AuthUser = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
  authLogger.debug("PASSPORT_DESERIALIZE", "User deserialized successfully", { userId: id });
  done(null, authUser);
});
