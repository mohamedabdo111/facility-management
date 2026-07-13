import mongoose from "mongoose";

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
    images: [String],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  { timestamps: true },
);


TaskSchema.pre("findOneAndUpdate", async function () {
  delete this.isDeleted;
  
});

const TaskModel = Model("Task", TaskSchema);

export default TaskModel;
