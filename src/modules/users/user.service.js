import asyncHandler from "express-async-handler";
import UserModel from "./user.model.js";

const createUser = asyncHandler(async (req, res) => {
  const user = await UserModel.create({
    ...req.body,
    tenantId: req.user.tenantId,
  });
  res.status(201).json({
    message: "User created successfully",
    success: true,
    data: user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const total = await UserModel.countDocuments({ tenantId: req.user.tenantId });
  const users = await UserModel.find({ tenantId: req.user.tenantId })
    .skip(skip)
    .limit(limit);

  const pagination = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
  };
  res.status(200).json({
    message: "Users fetched successfully",
    success: true,
    data: users,
    pagination,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  });
  // if (!user) {
  //   return res.status(404).json({
  //     message: "User not found",
  //     success: false,
  //   });
  // }
  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    data: user,
  });
});

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

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.status(200).json({
    message: "User deleted successfully",
    success: true,
  });
});
export { createUser, getUsers, getUserById, updateUser, deleteUser };
