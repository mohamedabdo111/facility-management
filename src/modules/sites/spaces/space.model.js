import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SpaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    description: String,

    spaceType: {
      type: String,
      enum: ["room", "floor", "building", "warehouse", "area"],
      default: "area",
    },

    parentSpaceId: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      default: null,
    },

    code: {
      type: String,
      required: [true, "Code is required"],
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
  },
  { timestamps: true },
);

// mogoose middleware to filter out deleted spaces
// SpaceSchema.index(
//   {
//     tenantId: 1,
//     siteId: 1,
//     code: 1,
//   },
//   { unique: true },
// );
SpaceSchema.pre(/^find/, function () {
  this.where({ isDeleted: false, deletedAt: null });
});
const SpaceModel = mongoose.model("Space", SpaceSchema);

export default SpaceModel;
