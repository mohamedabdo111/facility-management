import multer from "multer";
import ApiError from "../../utils/ApiErrors.js";
import expressAsyncHandler from "express-async-handler";
import sharp from "sharp";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Invalid file type"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

/** Optional report images → req.body.images */
const optionalReportImages = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.body.images = [];
    return next();
  }

  const images = [];
  for (const [index, file] of req.files.entries()) {
    const fileName = `task-${Date.now()}-${index}.webp`;
    await sharp(file.buffer)
      .webp({ quality: 60 })
      .toFile(`uploads/tasks/${fileName}`);
    images.push(`tasks/${fileName}`);
  }

  req.body.images = images;
  next();
});

/** Optional completion images → req.body.completionImages */
const optionalCompletionImages = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.body.completionImages = [];
    return next();
  }

  const images = [];
  for (const [index, file] of req.files.entries()) {
    const fileName = `task-complete-${Date.now()}-${index}.webp`;
    await sharp(file.buffer)
      .webp({ quality: 60 })
      .toFile(`uploads/tasks/${fileName}`);
    images.push(`tasks/${fileName}`);
  }

  req.body.completionImages = images;
  next();
});

export { upload, optionalReportImages, optionalCompletionImages };
