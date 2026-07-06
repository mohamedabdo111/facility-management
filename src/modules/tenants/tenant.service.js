import expressAsyncHandler from "express-async-handler";
import TenantModel from "./tenant.model.js";
import UserModel from "../users/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const createTenant = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tenant = await TenantModel.create(
      [
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
        },
      ],
      { session },
    );

    const hashPassword = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );
    await UserModel.create(
      [
        {
          name: req.body.name,
          email: req.body.email,
          password: hashPassword,
          role: "Owner",
          tenantId: tenant[0]._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res.status(201).json(tenant);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


export const getUserTenant = expressAsyncHandler(async (req, res) => {
  const UserTenant = await UserModel.findOne({_id: req.user._id}).select("tenantId").populate("tenantId");

  if (!UserTenant) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(UserTenant);
});

export const getAllUsersOfTenant = expressAsyncHandler(async (req ,res ) => {
  const {tenantId} = req.user

  const users = await UserModel.find({tenantId: tenantId});

  if (!users) {
    return res.status(404).json({ message: "Users not found" });
  }

  res.status(200).json({
    message: "Users fetched successfully",
    data: users,
  });
})