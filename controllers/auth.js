const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');

//@desc     Register User
//@route    GET /api/auth/register
//@access   Public

exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
