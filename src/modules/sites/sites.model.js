import mongoose from "mongoose";

const schema = mongoose.Schema;
const model = mongoose.model;

const SiteSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
      required: true,
    },
    tenantId: {
      type: schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },

    address: {
      city: String,
      state: String,
      country: String,
      postalCode: String,
      street: String,
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
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

const SiteModel = model("Sites", SiteSchema);

export default SiteModel;
