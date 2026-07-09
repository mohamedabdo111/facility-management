import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BuildingSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  description:{
    type: String,
    required: [true, "Description is required"],
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


}, { timestamps: true });

// mogoose middleware to filter out deleted buildings
BuildingSchema.pre(/^find/, function() {
  this.where({ isDeleted: false, deletedAt: null });
});
const BuildingModel = mongoose.model("Building", BuildingSchema);

export default BuildingModel;