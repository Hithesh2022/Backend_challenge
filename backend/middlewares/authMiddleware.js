import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js"; 
export const isApiAuthenticated = async (req, res, next) => {
  //  check if token is present in headers
  if (!req.headers.authorization) {

    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // verify the token
  const token = req.headers.authorization.split(" ")[1];
  const blacklistedToken = await Blacklist.findOne({ token: token });
  if (blacklistedToken) {

    res.status(401).json({ error: "Unauthorized Please Login First " });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {

      res.status(401).json({ error: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
};
