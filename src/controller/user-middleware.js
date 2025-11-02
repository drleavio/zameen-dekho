import jwt from "jsonwebtoken";

// secret key used for signing the JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const userMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Get the token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Attach user info to the request for later use
    req.user = decoded;

    // 4️⃣ Continue to next middleware or route
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
