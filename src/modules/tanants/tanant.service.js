import expressAsyncHandler from "express-async-handler";
import TanantModel from "./tanant.model.js";
import UserModel from "../users/user.model.js";
import mongoose from "mongoose";

export const createTanant = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  //   const { name, email, password, phone, address } = req.body;
  //   const tanant = await TanantModel.create(req.body);
  //   if (tanant) {
  //     await UserModel.create({
  //       name,
  //       email,
  //       password,
  //       role: "admin",
  //       tanantId: tanant._id,
  //     });
  //   }
  //   res.status(201).json(tanant);
  try {
    const tanant = await TanantModel.create(
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

    await UserModel.create(
      [
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: "admin",
          tanantId: tanant[0]._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res.status(201).json(tanant);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


