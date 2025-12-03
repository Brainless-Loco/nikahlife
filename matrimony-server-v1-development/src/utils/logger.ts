import fs from "fs";
import path from "path";

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const authLogFile = path.join(logsDir, "google-auth.log");
const errorLogFile = path.join(logsDir, "google-auth-errors.log");

// Format timestamp
const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Format log entry
const formatLogEntry = (level: string, step: string, message: string, data?: any): string => {
  const entry = {
    timestamp: getTimestamp(),
    level,
    step,
    message,
    data: data || null,
  };
  return JSON.stringify(entry) + "\n";
};

// Write to log file
const writeToFile = (filePath: string, content: string): void => {
  try {
    fs.appendFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
};

// Logger object with methods for different log levels
export const authLogger = {
  /**
   * Log info level message
   */
  info: (step: string, message: string, data?: any): void => {
    const logEntry = formatLogEntry("INFO", step, message, data);
    writeToFile(authLogFile, logEntry);
    console.log(`[${getTimestamp()}] [INFO] [${step}] ${message}`, data ? JSON.stringify(data) : "");
  },

  /**
   * Log warning level message
   */
  warn: (step: string, message: string, data?: any): void => {
    const logEntry = formatLogEntry("WARN", step, message, data);
    writeToFile(authLogFile, logEntry);
    console.warn(`[${getTimestamp()}] [WARN] [${step}] ${message}`, data ? JSON.stringify(data) : "");
  },

  /**
   * Log error level message
   */
  error: (step: string, message: string, error?: any): void => {
    const errorData = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    
    const logEntry = formatLogEntry("ERROR", step, message, errorData);
    writeToFile(authLogFile, logEntry);
    writeToFile(errorLogFile, logEntry);
    console.error(`[${getTimestamp()}] [ERROR] [${step}] ${message}`, errorData || "");
  },

  /**
   * Log debug level message (only in development)
   */
  debug: (step: string, message: string, data?: any): void => {
    if (process.env.NODE_ENV === "development") {
      const logEntry = formatLogEntry("DEBUG", step, message, data);
      writeToFile(authLogFile, logEntry);
      console.log(`[${getTimestamp()}] [DEBUG] [${step}] ${message}`, data ? JSON.stringify(data) : "");
    }
  },

  /**
   * Log the start of a process
   */
  start: (step: string, message: string, data?: any): void => {
    const logEntry = formatLogEntry("START", step, message, data);
    writeToFile(authLogFile, logEntry);
    console.log(`[${getTimestamp()}] [START] [${step}] ▶️ ${message}`, data ? JSON.stringify(data) : "");
  },

  /**
   * Log successful completion of a process
   */
  success: (step: string, message: string, data?: any): void => {
    const logEntry = formatLogEntry("SUCCESS", step, message, data);
    writeToFile(authLogFile, logEntry);
    console.log(`[${getTimestamp()}] [SUCCESS] [${step}] ✅ ${message}`, data ? JSON.stringify(data) : "");
  },
};

export default authLogger;
