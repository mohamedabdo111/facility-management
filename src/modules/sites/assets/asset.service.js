import ApiError from "../../../utils/ApiErrors.js";
import AssetModel from "./asset.model.js";

export const createAsset = async (req, res) => {
  const {
    name,
    description,
    code,
    assetType,
    serialNumber,
    status,
    spaceId,
  } = req.body;

  const asset = await AssetModel.create({
    name,
    description,
    code,
    assetType,
    serialNumber,
    status,
    spaceId: spaceId || null,
    tenantId: req.user.tenantId,
    image: req.body.image,
    siteId: req.params.siteId,
  });

  return res.status(201).json({
    success: true,
    message: "Asset created successfully",
    data: asset,
  });
};

export const getAssets = async (req, res) => {
  const assets = await AssetModel.find({
    tenantId: req.user.tenantId,
    siteId: req.params.siteId,
  });

  res.status(200).json({
    message: "Assets fetched successfully",
    success: true,
    data: assets,
  });
};

export const getAssetById = async (req, res) => {
  const asset = await AssetModel.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
    siteId: req.params.siteId,
  });

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  res.status(200).json({
    message: "Asset fetched successfully",
    success: true,
    data: asset,
  });
};

export const updateAsset = async (req, res) => {
  const {
    name,
    description,
    code,
    assetType,
    serialNumber,
    status,
    spaceId,
  } = req.body;

  const asset = await AssetModel.findOneAndUpdate(
    {
      _id: req.params.id,
      tenantId: req.user.tenantId,
      siteId: req.params.siteId,
    },
    {
      name,
      description,
      code,
      assetType,
      serialNumber,
      status,
      spaceId,
    },
    { new: true, runValidators: true },
  );

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  res.status(200).json({
    message: "Asset updated successfully",
    success: true,
    data: asset,
  });
};

export const deleteAsset = async (req, res) => {
  const asset = await AssetModel.findOneAndUpdate(
    {
      _id: req.params.id,
      tenantId: req.user.tenantId,
      siteId: req.params.siteId,
    },
    { isDeleted: true, deletedAt: new Date() },
  );

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  res.status(200).json({
    message: "Asset deleted successfully",
    success: true,
    data: asset,
  });
};
