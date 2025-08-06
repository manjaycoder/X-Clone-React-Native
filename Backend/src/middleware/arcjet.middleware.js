import { aj } from "../config/arcjet.js";

// Arcjet middleware for rate limiting, not protection and security

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // Each request consumes 1 token
    });

    // Handle denied requests
    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot Access Denied",
          message: "Automated requests are not allowed.",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy.",
        });
      }
    }

    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      return res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};
