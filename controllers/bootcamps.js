const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// const geoCoder = require('..utils')

//@desc     Get all bootcamps
//@route    GET /api/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single bootcamp
//@route    GET /api/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp with Id: ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc     Create new bootcamp
//@route    POST /api/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
//@desc     Update bootcamp//@route    PUT /api/bootcamps/:id//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return res.status(400).json({ success: false, data: null });
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc     Delete bootcamp
//@route    DELETE /api/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false, data: null });
    }
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

//@desc     Upload Photo for bootcamp
//@route    PUT /api/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp with Id: ${req.params.id} not found`, 404)
    );
  }
  if (!req.files) {
    return next(new errorResponse('Please upload a file', 400));
  }

  const file = req.files.file;
  // make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new errorResponse('Please upload only img file', 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse('Please upload a file less than 100000 size', 400)
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLAOD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new errorResponse('Problem with file upload', 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

//@desc     Get Bootcamps within a radius
//@route    GET /api/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
});
