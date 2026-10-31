import rateLimit from 'express-rate-limit'

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,        // 1 ghanta
  max: 10,                         // 10 AI requests per user
  keyGenerator: (req) => req.userId,   // requireUser pehle chalta hai
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Hourly AI limit reached, please try again later.' },
})