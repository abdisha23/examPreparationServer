const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          next();
        } else {
          throw new Error('User not found');
        }
      }
    } catch (error) {
      throw new Error('Not authorized: Token expired or invalid. Please log in again!');
    }
  } else {
    throw new Error('No token attached to the header!');
  }
});
const isAdmin = asyncHandler( async(req, res, next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if((adminUser.role !== 'admin')){
    throw new Error('You are not admin!');
    }
    else{
    next();
    }
    });
    
const isSME = asyncHandler( async(req, res, next) => {
    const {email} = req.user;
    const smeUser = await User.findOne({email});
    if((smeUser.role !== 'sme')){
    throw new Error('You are not sme!');
    }
    else{
    next();
    }
    });
    
module.exports = {authMiddleware, isAdmin};