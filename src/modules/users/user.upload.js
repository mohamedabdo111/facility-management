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
  if (!req.file) {
    return next();
  }
  const fileName = `user-${Date.now()}.webp`;
  await sharp(req.file.buffer).webp({ quality: 60 }).toFile(`uploads/users/${fileName}`);
  req.body.image = `users/${fileName}`;
  next();
});

export { upload, imageProcessor };
