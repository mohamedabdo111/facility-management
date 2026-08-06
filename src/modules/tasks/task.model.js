import mongoose from "mongoose";
import crypto from "crypto";

const opts = { toJSON: { virtuals: true } };
const Schema = mongoose.Schema;
const Model = mongoose.model;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    spaceId: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    dueDate: Date,
    estimatedTime: Number,
    // Images from the issue reporter (QR / create)
    images: [String],
    // Images from technician after solving
    completionImages: [String],
    completionNotes: {
      type: String,
      default: null,
    },
    technicianName: {
      type: String,
      default: null,
    },

    // Token for public technician complete / view links
    publicToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      default: () => crypto.randomUUID(),
    },

    source: {
      type: String,
      enum: ["internal", "public_qr"],
      default: "internal",
    },

    reporterName: {
      type: String,
      default: null,
    },
    reporterContact: {
      type: String,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    startAt: Date,
    completedAt: Date,

    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, ...opts },
);

TaskSchema.virtual("imagesUrls").get(function () {
  if (!this.images || this.images.length === 0) {
    return [];
  }
  return this.images.map(
    (image) => `${process.env.APP_URL}/uploads/${image}`,
  );
});

TaskSchema.virtual("completionImagesUrls").get(function () {
  if (!this.completionImages || this.completionImages.length === 0) {
    return [];
  }
  return this.completionImages.map(
    (image) => `${process.env.APP_URL}/uploads/${image}`,
  );
});

TaskSchema.pre("findOneAndUpdate", async function () {
  delete this.isDeleted;
});

const TaskModel = Model("Task", TaskSchema);

export default TaskModel;
