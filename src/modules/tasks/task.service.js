import expressAsyncHandler from "express-async-handler";
import TaskModel from "./task.model.js";
import getAllMethod, { deleteMethod, getOneMethod, updateMethod } from "../../handler/handlerFactory.js";


export const createTask = expressAsyncHandler(async (req , res) => {
    const { title, description, siteId, spaceId, assignedTo, category, priority, status, dueDate, estimatedTime, images, createdBy } = req.body;

    const task = await TaskModel.create({ title, description, tenantId : req.user.tenantId, siteId, spaceId, assignedTo, category, priority, status, dueDate, estimatedTime, images, createdBy });

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


