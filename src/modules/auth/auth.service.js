import asyncHandler from "express-async-handler";
import UserModel from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    message: "Login successful",
    success: true,
    data: {
      token,
      user,
    },
  });
});
