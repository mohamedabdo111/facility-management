import mongoose from "mongoose";

const opts = { toJSON: { virtuals: true } };

const Schema = mongoose.Schema;

const AssetSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    description: String,

    assetType: {
      type: String,
      enum: [
        "equipment",
        "hvac",
        "electrical",
        "plumbing",
        "furniture",
        "vehicle",
        "other",
      ],
      default: "equipment",
    },

    code: {
      type: String,
      required: [true, "Code is required"],
    },

    serialNumber: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
    },

    spaceId: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      default: null,
    },

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },

    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: [true, "Site is required"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, ...opts },
);

AssetSchema.virtual("imageUrl").get(function () {
  if (!this.image) {
    return null;
  }
  return `${process.env.APP_URL}/uploads/${this.image}`;
});

AssetSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

const AssetModel = mongoose.model("Asset", AssetSchema);

export default AssetModel;
