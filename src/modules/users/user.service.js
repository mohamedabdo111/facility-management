import asyncHandler from 'express-async-handler';
import UserModel from './user.model.js';

const createUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, password, role } = req.body;
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
});

export default createUser;