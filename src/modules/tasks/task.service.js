import expressAsyncHandler from "express-async-handler";
import TaskModel from "./task.model.js";
import getAllMethod, { deleteMethod, getOneMethod, updateMethod } from "../../handler/handlerFactory.js";
import ApiError from "../../utils/ApiErrors.js";


export const createTask = expressAsyncHandler(async (req , res) => {
    const { title, description, siteId, spaceId, assignedTo, category, priority, status, dueDate, estimatedTime, images, createdBy } = req.body;

    const task = await TaskModel.create({
      title,
      description,
      tenantId: req.user.tenantId,
      siteId,
      spaceId,
      assignedTo,
      category,
      priority,
      status,
      dueDate,
      estimatedTime,
      images,
      createdBy: createdBy || req.user._id,
      source: "internal",
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        task,
    });
});

export const updateTask = updateMethod(TaskModel , "task");


export const getAllTasks = getAllMethod(TaskModel , "tasks");

export const getTask = getOneMethod(TaskModel , "task");

export const deleteTask = deleteMethod(TaskModel , "task");

/** Authenticated technician/admin complete with images */
export const completeTask = expressAsyncHandler(async (req, res) => {
  const task = await TaskModel.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
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

  const isStaff =
    req.user.role === "Owner" ||
    req.user.role === "Admin" ||
    req.user.role === "Supervisor";

  if (
    req.user.role === "Technician" &&
    task.assignedTo &&
    String(task.assignedTo) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can only complete tasks assigned to you");
  }

  if (!isStaff && req.user.role !== "Technician") {
    throw new ApiError(403, "Not allowed to complete this task");
  }

  const { completionNotes } = req.body;
  const newImages = req.body.completionImages || [];

  if (!task.startAt) {
    task.startAt = new Date();
  }

  task.status = "completed";
  task.completedAt = new Date();
  task.completionNotes = completionNotes || null;
  task.completionImages = [...(task.completionImages || []), ...newImages];

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task completed successfully",
    data: task,
  });
});


