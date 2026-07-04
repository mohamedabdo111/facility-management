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
