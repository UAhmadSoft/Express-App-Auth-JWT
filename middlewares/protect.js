const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//  Protecting Routes
module.exports = catchAsync(async (req, res, next) => {
  // 1- get the token check if exist
  let token;
  if (req.headers && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // 'Bearer 123'
  }

  if (!token) return next(new AppError('Not Logged In', 400));

  // 2- validate the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3- check user exits
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new AppError('User not exists with this token', 400));

  req.user = user;
  next();
});
