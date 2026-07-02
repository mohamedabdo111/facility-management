import mongoose from 'mongoose';

const schema = mongoose.Schema;
const model = mongoose.model;

const UserSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exists']
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'Technician' , 'Customer' , "Supervisor"],
        default: 'user'
    },
    tanantId: {
        type: schema.Types.ObjectId,
        ref: 'Tanant',
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UserModel = model('User', UserSchema);

export default UserModel;