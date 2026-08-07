import multer from "multer";
import ApiError from "../../../utils/ApiErrors.js";
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
  if (!req.file) {
    return next(new ApiError(400, "No file uploaded"));
  }
  const fileName = `asset-${Date.now()}.webp`;
  await sharp(req.file.buffer)
    .webp({ quality: 60 })
    .toFile(`uploads/assets/${fileName}`);
  req.body.image = `assets/${fileName}`;
  next();
});
export { upload, imageProcessor };
