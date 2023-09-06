const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { statusCode: 429, error: "Too many requests", message: "Trop de requêtes, veuillez réessayer plus tard" },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = { rateLimiter };
