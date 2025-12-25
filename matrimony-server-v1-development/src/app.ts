import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
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

const staticAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://matrimony-client-henna.vercel.app",
  "https://www.nikahlife.com",
  "https://nikahlife.vercel.app",
];

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set<string>([...staticAllowedOrigins, ...envAllowedOrigins]);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol === "https:" && hostname.endsWith(".vercel.app")) {
        return callback(null, true);
      }
    } catch (error) {
      console.warn("Invalid origin header received", origin, error);
      return callback(error as Error, false);
    }

    console.warn("CORS origin blocked", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "Accept",
    "X-Requested-With",
    "Origin",
  ],
  exposedHeaders: ["Content-Length", "X-JSON-Response"],
  maxAge: 3600,
  optionsSuccessStatus: 200,
};

// CORS setup - Allow specific origins with credentials
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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