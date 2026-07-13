import expressAsyncHandler from "express-async-handler";
import APIFeatures from "../utils/ApiFeature.js";
import ApiError from "../utils/ApiErrors.js";

export const getAllMethod = (Model, resource) =>
  expressAsyncHandler(async (req, res) => {
    // build query

    const totalDocs = await Model.countDocuments({
      tenantId: req.user.tenantId,
      isDeleted: false,
    });

    const features = new APIFeatures(
      Model.find({ tenantId: req.user.tenantId, isDeleted: false }),
      req.query,
    )
      .filter()
      .limitFields()
      .paginate(totalDocs);

    // execute query
    const { query, pagination } = features;
    const docs = await query;

    res.status(200).json({
      success: true,
      message: `${resource} fetched successfully`,
      data: docs,
      pagination,
    });
  });

export default getAllMethod;

export const getOneMethod = (Model, resource) =>
  expressAsyncHandler(async (req, res) => {
    const doc = await Model.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
      isDeleted: false,
    });
    if (!doc) {
      throw new ApiError(404, `${resource} not found`);
    }

    res.status(200).json({
      message: `${resource} fetched successfully`,
      success: true,
      data: doc,
    });
  });

export const deleteMethod = (Model, resource) =>
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(
      {
        _id: id,
        tenantId: req.user.tenantId,
        isDeleted: false,
      },
      { isDeleted: true, deletedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!doc) {
      throw new ApiError(404, `${resource} not found`);
    }
    res.status(200).json({
      message: `${resource} deleted successfully`,
      success: true,
    });
  });

export const updateMethod = (Model, resource) =>
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const doc = await Model.findOneAndUpdate(
      { _id: id, tenantId: req.user.tenantId },
      req.body,
      { new: true },
    );
    if (!doc) {
      throw new ApiError(404, `${resource} not found`);
    }
    res.status(200).json({
      message: `${resource} updated successfully`,
      success: true,
      data: doc,
    });
  });

export const createMethod = (Model, resource) => {
  expressAsyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      message: `${resource} created successfully`,
      success: true,
      data: doc,
    });
  });
};
