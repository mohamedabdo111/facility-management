/**
 * One-time backfill for public QR tokens on existing spaces/tasks.
 * Usage: node scripts/backfill-public-tokens.js
 */
import dotenv from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";
import SpaceModel from "../src/modules/sites/spaces/space.model.js";
import TaskModel from "../src/modules/tasks/task.model.js";

dotenv.config();

const uri = process.env.DB_URI;
if (!uri) {
  console.error("DB_URI is missing");
  process.exit(1);
}

await mongoose.connect(uri);

const spaces = await SpaceModel.find({
  $or: [{ publicId: null }, { publicId: { $exists: false } }],
});
for (const space of spaces) {
  space.publicId = crypto.randomUUID();
  await space.save();
}
console.log(`Backfilled publicId on ${spaces.length} spaces`);

const tasks = await TaskModel.find({
  $or: [{ publicToken: null }, { publicToken: { $exists: false } }],
});
for (const task of tasks) {
  task.publicToken = crypto.randomUUID();
  await task.save();
}
console.log(`Backfilled publicToken on ${tasks.length} tasks`);

await mongoose.disconnect();
console.log("Done");
