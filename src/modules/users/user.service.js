import asyncHandler from "express-async-handler";
import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import { getAllMethod, getOneMethod, deleteMethod } from "../../handler/handlerFactory.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, image } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role,
    image,
    tenantId: req.user.tenantId,
  });
  res.status(201).json({ message: "User created successfully", success: true, data: user });
});

const getUsers = getAllMethod(UserModel, "users");

const getUserById = getOneMethod(UserModel, "user");

export const getMe = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  const user = await UserModel.findById(req.user._id.toString());
  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await UserModel.findOneAndUpdate(
    { _id: req.user._id, tenantId: req.user.tenantId },
    { name, email },
    { new: true },
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
  res.status(200).json({
    message: "User updated successfully",
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = await UserModel.findOneAndUpdate(
    { _id: id, tenantId: req.user.tenantId },
    { name, email, role },
    { new: true },
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
  res.status(200).json({
    message: "User updated successfully",
    success: true,
    data: user,
  });
});

const deleteUser = deleteMethod(UserModel, "user");
export { createUser, getUsers, getUserById, updateUser, deleteUser };
