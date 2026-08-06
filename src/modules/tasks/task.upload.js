import multer from "multer";
import ApiError from "../../utils/ApiErrors.js";
import expressAsyncHandler from "express-async-handler";
import sharp from "sharp";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
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

const imageProcessor = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, "No file uploaded"));
  }

  const images = [];
  for (const [index, file] of req.files.entries()) {
    const fileName = `task-${Date.now()}-${index}.webp`;
    await sharp(file.buffer)
      .toFormat("webp")
      .toFile(`uploads/tasks/${fileName}`);
    images.push(`tasks/${fileName}`);
  }

  req.body.images = images;
  next();
});

export { upload, imageProcessor };
