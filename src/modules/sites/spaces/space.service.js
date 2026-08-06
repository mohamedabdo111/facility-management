import crypto from "crypto";
import ApiError from "../../../utils/ApiErrors.js";
import SpaceModel from "./space.model.js";

const ensurePublicId = async (space) => {
  if (space.publicId) return space;
  space.publicId = crypto.randomUUID();
  await space.save();
  return space;
};

export const createSpace = async (req, res) => {
  const { name, description, code , spaceType , parentSpaceId } = req.body;
  const space = await SpaceModel.create({
    name,
    description,
    code,
    spaceType,
    parentSpaceId,
    tenantId: req.user.tenantId,
    image: req.body.image,
    siteId: req.params.siteId,
  });
  return res.status(201).json({
    success: true,
    message: "Space created successfully",
    data: space,
  });
};

export const getSpaces = async (req, res) => {
  const spaces = await SpaceModel.find({
    tenantId: req.user.tenantId,
    siteId: req.params.siteId,
  });

  await Promise.all(spaces.map((space) => ensurePublicId(space)));

  res.status(200).json({
    message: "Spaces fetched successfully",
    success: true,
    data: spaces,
  });
};

export const getSpaceById = async (req, res) => {
  let space = await SpaceModel.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
    siteId: req.params.siteId,
  });
  if (!space) {
    throw new ApiError(404, "Space not found");
  }
  space = await ensurePublicId(space);
  res.status(200).json({
    message: "Space fetched successfully",
    success: true,
    data: space,
  });
};

export const updateSpace = async (req, res) => {
  const { name, description, code } = req.body;
  const space = await SpaceModel.findOneAndUpdate(
    {
      _id: req.params.id,
      tenantId: req.user.tenantId,
      siteId: req.params.siteId,
    },
    {
      name,
      description,
      code,
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    message: "Space updated successfully",
    success: true,
    data: space,
  });
};

export const deleteSpace = async (req, res) => {
  const space = await SpaceModel.findOneAndUpdate(
    {
      _id: req.params.id,
      tenantId: req.user.tenantId,
      siteId: req.params.siteId,
    },
    { isDeleted: true, deletedAt: new Date() },
  );
  res.status(200).json({
    message: "Space deleted successfully",
    success: true,
    data: space,
  });
};
