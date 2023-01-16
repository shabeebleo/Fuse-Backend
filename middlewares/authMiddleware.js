import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";


const protect = asyncHandler(async (req, res, next) => {

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1];
    
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get user from token
      // let userDetails = await userModel.findById(decoded.id).select("-password");
    
      req.userId=decoded.id
      next();
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('not authorised')
    }
  }
  if(!token){
    res.status(401)
    throw new Error("not authorised,no token")
  }
});

export default protect
