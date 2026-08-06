import crypto from "crypto";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import SpaceModel from "../sites/spaces/space.model.js";
import SiteModel from "../sites/sites.model.js";
import CategoryModel from "../categories/category.model.js";
import TaskModel from "../tasks/task.model.js";
import ApiError from "../../utils/ApiErrors.js";

const toPublicSpace = (space, site) => ({
  publicId: space.publicId,
  name: space.name,
  description: space.description,
  spaceType: space.spaceType,
  code: space.code,
  imageUrl: space.imageUrl,
  site: site
    ? {
        name: site.name,
        code: site.code,
        address: site.address,
      }
    : null,
});

/** Resolve by publicId, or by Mongo _id for older spaces missing publicId */
const findSpaceByPublicParam = async (publicIdOrMongoId) => {
  let space = await SpaceModel.findOne({ publicId: publicIdOrMongoId });

  if (
    !space &&
    mongoose.Types.ObjectId.isValid(publicIdOrMongoId) &&
    String(new mongoose.Types.ObjectId(publicIdOrMongoId)) ===
      String(publicIdOrMongoId)
  ) {
    space = await SpaceModel.findById(publicIdOrMongoId);
  }

  if (!space) return null;

  if (!space.publicId) {
    space.publicId = crypto.randomUUID();
    await space.save();
  }

  return space;
};

export const getPublicSpace = expressAsyncHandler(async (req, res) => {
  const space = await findSpaceByPublicParam(req.params.publicId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  const site = await SiteModel.findById(space.siteId).select(
    "name code address",
  );

  res.status(200).json({
    success: true,
    message: "Space fetched successfully",
    data: toPublicSpace(space, site),
  });
});

export const getPublicSpaceCategories = expressAsyncHandler(
  async (req, res) => {
    const space = await findSpaceByPublicParam(req.params.publicId);
    if (!space) {
      throw new ApiError(404, "Space not found");
    }

    const categories = await CategoryModel.find({
      tenantId: space.tenantId,
      isDeleted: false,
    }).select("_id name");

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  },
);

export const createPublicReport = expressAsyncHandler(async (req, res) => {
  const space = await findSpaceByPublicParam(req.params.publicId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  const {
    title,
    description,
    category,
    priority,
    reporterName,
    reporterContact,
    images,
  } = req.body;

  const categoryDoc = await CategoryModel.findOne({
    _id: category,
    tenantId: space.tenantId,
    isDeleted: false,
  });
  if (!categoryDoc) {
    throw new ApiError(400, "Category not found");
  }

  const task = await TaskModel.create({
    title,
    description,
    category,
    priority: priority || "medium",
    tenantId: space.tenantId,
    siteId: space.siteId,
    spaceId: space._id,
    images: images || [],
    source: "public_qr",
    reporterName: reporterName || null,
    reporterContact: reporterContact || null,
    status: "pending",
    createdBy: null,
  });

  res.status(201).json({
    success: true,
    message: "Issue reported successfully",
    data: {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      imagesUrls: task.imagesUrls,
      createdAt: task.createdAt,
    },
  });
});

export const getPublicTask = expressAsyncHandler(async (req, res) => {
  const task = await TaskModel.findOne({
    publicToken: req.params.publicToken,
    isDeleted: false,
  })
    .populate("spaceId", "name code publicId")
    .populate("siteId", "name code")
    .populate("category", "name");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    message: "Task fetched successfully",
    data: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      space: task.spaceId,
      site: task.siteId,
      imagesUrls: task.imagesUrls,
      completionImagesUrls: task.completionImagesUrls,
      completionNotes: task.completionNotes,
      technicianName: task.technicianName,
      startAt: task.startAt,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
    },
  });
});

export const completePublicTask = expressAsyncHandler(async (req, res) => {
  const task = await TaskModel.findOne({
    publicToken: req.params.publicToken,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.status === "completed") {
    throw new ApiError(400, "Task is already completed");
  }

  if (task.status === "cancelled") {
    throw new ApiError(400, "Cancelled tasks cannot be completed");
  }

  const { completionNotes, technicianName } = req.body;
  const newImages = req.body.completionImages || [];

  if (!task.startAt) {
    task.startAt = new Date();
  }

  task.status = "completed";
  task.completedAt = new Date();
  task.completionNotes = completionNotes || null;
  task.technicianName = technicianName || null;
  task.completionImages = [...(task.completionImages || []), ...newImages];

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task completed successfully",
    data: {
      title: task.title,
      status: task.status,
      completionNotes: task.completionNotes,
      technicianName: task.technicianName,
      completionImagesUrls: task.completionImagesUrls,
      startAt: task.startAt,
      completedAt: task.completedAt,
    },
  });
});
