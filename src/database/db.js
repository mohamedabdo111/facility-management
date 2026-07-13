import mongoose from 'mongoose';
import SpaceModel from '../modules/sites/spaces/space.model.js';

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URI);
  
  console.log('Connected to MongoDB');
  console.log(await SpaceModel.collection.indexes());
};

export default connectDB;