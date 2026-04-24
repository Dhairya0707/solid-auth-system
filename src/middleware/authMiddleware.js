import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized, no token provided",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expried token",
    });
  }
}

export default authMiddleware;
