
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/envConfig";

let server: Server;

const startServer = async () => {
    try {
        // Database connection
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to DB!!");
        
        // Environment variables check
        console.log("Checking environment variables...");
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.warn("⚠️  GOOGLE_CLIENT_ID not found in environment variables");
        }
        if (!process.env.GOOGLE_CLIENT_SECRET) {
            console.warn("⚠️  GOOGLE_CLIENT_SECRET not found in environment variables");
        }
        if (!process.env.JWT_SECRET) {
            console.warn("⚠️  JWT_SECRET not found in environment variables");
        }
        
        // Start server
        server = app.listen(envVars.PORT, () => {
            console.log(`✅ Server is listening on port ${envVars.PORT}`);
        });
    } catch (error) {
        console.error("❌ Server startup error:", error);
    }
}

startServer();

// Graceful shutdown handlers
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log("SIGINT signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
