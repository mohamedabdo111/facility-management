import mongoose from "mongoose";

const opts = { toJSON: { virtuals: true } };
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
      required: [true, "Code is required"],
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

    image: {
      type: String,
      default: null,
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
  { timestamps: true, ...opts },
);

SiteSchema.virtual("imageUrl").get(function () {
  if (!this.image) {
    return null;
  }
  return `${process.env.APP_URL}/uploads/${this.image}`;
});

// SiteSchema.pre(/^find/, function () {
//   this.where({ isDeleted: false, deletedAt: null });
// });

const SiteModel = model("Sites", SiteSchema);

export default SiteModel;
