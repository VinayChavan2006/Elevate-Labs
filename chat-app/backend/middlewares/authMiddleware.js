import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

export const authenticate = async (req, res, next) => {
  try {
    // read the token in the cookie
    let token = req.cookies?.token;
    // console.log(req.cookies);
    
    if (!token) {
      return res.status(400).json({
        message: "Token Not Found",
        success: false,
      });
    } else {
      // decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // attach the req obj with user except the password field
      req.user = await User.findById(userId).select("-password");
      next();
    }
  } catch (error) {
    console.log(`authenticate middleware error: ${error}`);
    next();
  }
};
