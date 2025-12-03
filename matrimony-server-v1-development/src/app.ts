import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import router from "./routers";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./utils/notFound";

import "./config/passport";

const app = express();

// Vercel er jonno trust proxy
app.set("trust proxy", 1);

// CORS setup
app.use(cors({
  origin: [
    "https://www.nikahlife.com",
    "https://nikahlife.vercel.app",
    "https://nikah-test.vercel.app", 
    "http://localhost:3000",
    "http://localhost:5173",
    // '*'
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Cookie parser
app.use(cookieParser());

// Vercel-compatible session config
app.use(expressSession({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    store: process.env.NODE_ENV === 'production' 
      ? new (require('memorystore')(expressSession))({ 
          checkPeriod: 86400000 // 1 day
        }) 
      : undefined, // Development e memory use korbe
    cookie: {
        secure: true, // Vercel e always true (HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'none', // Vercel e 'none' must
        domain: process.env.NODE_ENV === 'production' 
          ? '.nikahlife.com' // Main domain for production
          : undefined // Local development e no domain restriction
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Mount routes on /api/v1 (versioned endpoint)
app.use("/api/v1", router);

// Also mount routes on /api for backward compatibility and future flexibility
// This allows frontend to use /api/... which maps to current version (v1)
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Nikah Server",
    });
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;