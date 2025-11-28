import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No access token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err && err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    if (err) {
      return res.status(403).json({ message: "Token invalid" });
    }

    req.user = user;
    next();
  });
};
