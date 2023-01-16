import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const adminProtect = asyncHandler(async (req, res, next) => {
  let adminToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      adminToken = req.headers.authorization.split(" ")[1];
      //verify token
      // eslint-disable-next-line
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

      next();
    } catch (error) {
      console.log(error, "kkkk");
      res.status(401);
      throw new Error("not Authorization");
    }
  }
  if (!adminToken) {
    res.status(401);
    throw new Error("not Authorization,no adminToken");
  }
});

export default adminProtect;
