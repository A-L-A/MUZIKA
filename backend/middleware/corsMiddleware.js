export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    // Development origins
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",

    // Production origins
    "https://muzika-frontend.onrender.com",
    "https://muzika-backend.onrender.com",

    // fallback
    process.env.FRONTEND_URL,
  ].filter(Boolean); 
  const origin = req.headers.origin;

  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  }

  // Set other CORS headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};
