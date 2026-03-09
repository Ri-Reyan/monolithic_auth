import jwt from "jsonwebtoken";

const protect =
  (...roles) =>
  (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401);
      throw new Error("Access token missing");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const role = decoded.role;

      if (!roles.includes(role)) {
        res.status(403);
        throw new Error("Insufficient permissions");
      }

      req.userId = decoded.id;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid or expired access token");
    }
  };

export default protect;
